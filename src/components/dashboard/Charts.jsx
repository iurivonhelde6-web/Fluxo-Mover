import React from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '../../lib/formatters'

/**
 * Tooltip customizado
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-stone-200 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-stone-700 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

/**
 * 🔥 Função padrão de normalização (REUTILIZÁVEL)
 */
const normalizeChartData = (data) => {
  return (Array.isArray(data) ? data : [])
    .filter(Boolean)
    .map(item => ({
      name: item?.label || '',
      entrada: item?.entradas ?? 0,
      saida: item?.saidas ?? 0,
    }))
}

/**
 * TrendChart
 */
export const TrendChart = ({ data }) => {
  const chartData = normalizeChartData(data)

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#15803D" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#15803D" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B91C1C" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#B91C1C" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />

          <XAxis dataKey="name" stroke="#78716C" fontSize={12} tickLine={false} />

          <YAxis
            stroke="#78716C"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => `R$ ${value / 1000}k`}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend />

          <Area
            type="monotone"
            dataKey="entrada"
            name="Entradas"
            stroke="#15803D"
            fill="url(#colorEntrada)"
          />

          <Area
            type="monotone"
            dataKey="saida"
            name="Saídas"
            stroke="#B91C1C"
            fill="url(#colorSaida)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * MonthlyChart
 */
export const MonthlyChart = ({ data }) => {
  const chartData = normalizeChartData(data)

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />

          <XAxis dataKey="name" stroke="#78716C" fontSize={12} tickLine={false} />

          <YAxis
            stroke="#78716C"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => `R$ ${value / 1000}k`}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend />

          <Bar dataKey="entrada" name="Entradas" fill="#15803D" radius={[4, 4, 0, 0]} />
          <Bar dataKey="saida" name="Saídas" fill="#B91C1C" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// 🎨 Cores
const COLORS = ['#B45309', '#15803D', '#C2410C', '#047857', '#78350F', '#065F46', '#92400E']

/**
 * CategoryChart
 */
export const CategoryChart = ({ data }) => {
  const safeData = typeof data === 'object' && data !== null ? data : {}

  const chartData = Object.entries(safeData)
    .filter(([_, values]) => values?.saida > 0)
    .map(([name, values]) => ({
      name,
      value: values?.saida ?? 0,
    }))
    .sort((a, b) => b.value - a.value)

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-stone-500">
        Nenhuma despesa para exibir
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            label={({ name, percent }) =>
              `${name} (${((percent || 0) * 100).toFixed(0)}%)`
            }
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * IncomeChart
 */
export const IncomeChart = ({ data }) => {
  const safeData = typeof data === 'object' && data !== null ? data : {}

  const chartData = Object.entries(safeData)
    .filter(([_, values]) => values?.entrada > 0)
    .map(([name, values]) => ({
      name,
      value: values?.entrada ?? 0,
    }))
    .sort((a, b) => b.value - a.value)

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-stone-500">
        Nenhuma entrada para exibir
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            label={({ name, percent }) =>
              `${name} (${((percent || 0) * 100).toFixed(0)}%)`
            }
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default {
  TrendChart,
  MonthlyChart,
  CategoryChart,
  IncomeChart,
}
