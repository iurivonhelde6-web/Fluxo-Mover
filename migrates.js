import fs from 'fs';
import csv from 'csv-parser';
import { createClient } from '@supabase/supabase-js';

// Configurações do seu projeto Supabase
const supabase = createClient('https://rrveddjgzgweauaufvdd.supabase.co', 'sb_publishable_SGdpfGXMiAuTmVcS_w4vsg_wl3JSxX_');

const results = [];

// Função para limpar e extrair dados do bloco de texto do cliente
const parseClienteDados = (texto) => {
  const nome = texto.match(/Nome completo:\s*(.*)/)?.[1] || "Não identificado";
  const cpf = texto.match(/CPF:\s*(.*)/)?.[1]?.replace(/\D/g, '') || null;
  const cep = texto.match(/CEP:\s*(.*)/)?.[1] || null;
  const cidade = texto.match(/Cidade:\s*(.*)/)?.[1] || null;
  const instagram = texto.match(/Instagram.*:\s*(.*)/)?.[1] || null;

  return { nome, cpf, cep, cidade, instagram, endereco_completo: texto };
};

// Função para converter "Total : 1815,00" em número 1815.00
const parseMoeda = (valorTexto) => {
  if (!valorTexto || valorTexto === "OK") return 0;
  const apenasNumeros = valorTexto.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(apenasNumeros) || 0;
};

fs.createReadStream('Calculator.csv')
  .pipe(csv({ skipLines: 2 })) // Pula o cabeçalho decorativo do seu CSV
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    console.log('🚀 Iniciando processamento de', results.length, 'linhas...');

    for (const row of results) {
      const clienteRaw = row['Cliente dados:'];
      if (!clienteRaw) continue;

      const infoCliente = parseClienteDados(clienteRaw);

      // 1. Insere ou busca o Cliente
      const { data: clienteData, error: clientError } = await supabase
        .from('clientes')
        .upsert({ 
          nome_completo: infoCliente.nome,
          documento_cpf: infoCliente.cpf,
          codigo_postal_cep: infoCliente.cep,
          endereco_residencial: infoCliente.endereco_completo
        }, { onConflict: 'documento_cpf' })
        .select()
        .single();

      if (clientError) {
        console.error('Erro ao inserir cliente:', infoCliente.nome);
        continue;
      }

      // 2. Insere o Pedido/Fluxo de Caixa relacionado
      const { error: pedidoError } = await supabase
        .from('fluxo_caixa')
        .insert({
          cliente_id: clienteData.id,
          descricao_lancamento: row['PEDIDO :']?.substring(0, 100), // Resumo do pedido
          valor_monetario: parseMoeda(row['Valor TOTAL:']),
          tipo_movimentacao: 'entrada',
          data_operacao: new Date() 
        });

      if (pedidoError) console.error('Erro no pedido de:', infoCliente.nome);
    }
    console.log('✅ Migração concluída com sucesso!');
  });