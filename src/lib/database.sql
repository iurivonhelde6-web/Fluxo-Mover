-- =====================================================
-- Mover Fluxo - Database Schema
-- PostgreSQL / Supabase
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: clientes
-- Stores customer/client information
-- =====================================================
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    cep VARCHAR(9),
    endereco TEXT,
    email VARCHAR(255),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster user-based queries
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_clientes_cpf ON clientes(cpf);

-- =====================================================
-- Table: transacoes
-- Stores financial transactions linked to clients
-- =====================================================
CREATE TABLE IF NOT EXISTS transacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    valor DECIMAL(12,2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    descricao TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_transacoes_cliente_id ON transacoes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_user_id ON transacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_data ON transacoes(data);
CREATE INDEX IF NOT EXISTS idx_transacoes_tipo ON transacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_transacoes_categoria ON transacoes(categoria);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on clientes table
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on transacoes table
ALTER TABLE transacoes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies for Clientes
-- =====================================================

-- Policy: Users can only see their own clients
CREATE POLICY IF NOT EXISTS "Users can view own clients" 
ON clientes FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can only insert their own clients
CREATE POLICY IF NOT EXISTS "Users can insert own clients" 
ON clientes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own clients
CREATE POLICY IF NOT EXISTS "Users can update own clients" 
ON clientes FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can only delete their own clients
CREATE POLICY IF NOT EXISTS "Users can delete own clients" 
ON clientes FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- RLS Policies for Transacoes
-- =====================================================

-- Policy: Users can only see their own transactions
CREATE POLICY IF NOT EXISTS "Users can view own transactions" 
ON transacoes FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can only insert their own transactions
CREATE POLICY IF NOT EXISTS "Users can insert own transactions" 
ON transacoes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own transactions
CREATE POLICY IF NOT EXISTS "Users can update own transactions" 
ON transacoes FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can only delete their own transactions
CREATE POLICY IF NOT EXISTS "Users can delete own transactions" 
ON transacoes FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- Function: Update updated_at timestamp
-- Automatically updates the updated_at column
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger: Update updated_at on clientes
DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes;
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update updated_at on transacoes
DROP TRIGGER IF EXISTS update_transacoes_updated_at ON transacoes;
CREATE TRIGGER update_transacoes_updated_at
    BEFORE UPDATE ON transacoes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Function: Validate CPF format
-- =====================================================
CREATE OR REPLACE FUNCTION validate_cpf_format(cpf TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    clean_cpf TEXT;
BEGIN
    -- Remove non-numeric characters
    clean_cpf := regexp_replace(cpf, '[^0-9]', '', 'g');
    
    -- Check if it has 11 digits
    IF length(clean_cpf) != 11 THEN
        RETURN FALSE;
    END IF;
    
    -- Check for known invalid CPFs
    IF clean_cpf = repeat(substring(clean_cpf from 1 for 1), 11) THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- View: Dashboard Summary
-- Provides aggregated data for dashboard
-- =====================================================
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT 
    user_id,
    COUNT(*) as total_transacoes,
    SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) as total_entradas,
    SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) as total_saidas,
    SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END) as saldo
FROM transacoes
GROUP BY user_id;

-- =====================================================
-- View: Transactions by Category
-- Provides category breakdown for charts
-- =====================================================
CREATE OR REPLACE VIEW transactions_by_category AS
SELECT 
    user_id,
    categoria,
    tipo,
    SUM(valor) as total,
    COUNT(*) as quantidade
FROM transacoes
GROUP BY user_id, categoria, tipo;

-- =====================================================
-- View: Monthly Transactions
-- Provides monthly aggregated data
-- =====================================================
CREATE OR REPLACE VIEW monthly_transactions AS
SELECT 
    user_id,
    EXTRACT(YEAR FROM data) as ano,
    EXTRACT(MONTH FROM data) as mes,
    SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) as entradas,
    SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) as saidas,
    COUNT(*) as quantidade
FROM transacoes
GROUP BY user_id, EXTRACT(YEAR FROM data), EXTRACT(MONTH FROM data);

-- =====================================================
-- Comment on tables for documentation
-- =====================================================
COMMENT ON TABLE clientes IS 'Armazena informações dos clientes/cadastros';
COMMENT ON TABLE transacoes IS 'Armazena as transações financeiras (entradas e saídas)';
COMMENT ON COLUMN clientes.cpf IS 'CPF do cliente com formato XXX.XXX.XXX-XX';
COMMENT ON COLUMN clientes.cep IS 'CEP do endereço no formato XXXXX-XXX';
COMMENT ON COLUMN transacoes.tipo IS 'Tipo da transação: entrada ou saida';
COMMENT ON COLUMN transacoes.categoria IS 'Categoria da transação: Aluguel, Vendas, Serviços, etc.';

