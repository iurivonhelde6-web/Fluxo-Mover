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
import { formatCurrency, getMonthName } from '../../lib/formatters'

/**
 * Custom Tooltip Component for Charts
 * 
 * Displays formatted values with glassmorphism effect.
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
 * TrendChart Component
 * 
 * Area chart showing income vs expenses over time.
 */
export const TrendChart = ({ data }) => {
  // Transform data for chart
  const chartData = data.map(item => ({
    name: getMonthName(parseInt(item.month.split('-')[1]) - 1),
    entrada: item.entrada || 0,
    saida: item.saida || 0,
  }))

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
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
          <XAxis 
            dataKey="name" 
            stroke="#78716C" 
            fontSize={12}
            tickLine={false}
          />
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
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorEntrada)"
          />
          <Area
            type="monotone"
            dataKey="saida"
            name="Saídas"
            stroke="#B91C1C"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSaida)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * MonthlyChart Component
 * 
 * Bar chart comparing income and expenses by month.
 */
export const MonthlyChart = ({ data }) => {
  // Transform data for chart
  const chartData = data.map(item => ({
    name: getMonthName(parseInt(item.month.split('-')[1]) - 1),
    entrada: item.entrada || 0,
    saida: item.saida || 0,
  }))

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
          <XAxis 
            dataKey="name" 
            stroke="#78716C" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#78716C" 
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => `R$ ${value / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="entrada"
            name="Entradas"
            fill="#15803D"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="saida"
            name="Saídas"
            fill="#B91C1C"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Color palette for pie chart
const COLORS = ['#B45309', '#15803D', '#C2410C', '#047857', '#78350F', '#065F46', '#92400E']

/**
 * CategoryChart Component
 * 
 * Pie chart showing expenses by category.
 */
export const CategoryChart = ({ data }) => {
  // Transform data for pie chart
  const chartData = Object.entries(data)
    .filter(([_, values]) => values.saida > 0)
    .map(([name, values]) => ({
      name,
      value: values.saida,
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
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
 * IncomeChart Component
 * 
 * Pie chart showing income by category.
 */
export const IncomeChart = ({ data }) => {
  // Transform data for pie chart
  const chartData = Object.entries(data)
    .filter(([_, values]) => values.entrada > 0)
    .map(([name, values]) => ({
      name,
      value: values.entrada,
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
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

