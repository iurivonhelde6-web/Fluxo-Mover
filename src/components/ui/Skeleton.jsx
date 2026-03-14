import React from 'react'

/**
 * Skeleton Component
 * 
 * A loading placeholder component that mimics the shape of content.
 * Used to show loading states while data is being fetched.
 */
const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'pulse',
}) => {
  const variantClasses = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    avatar: 'h-10 w-10 rounded-full',
    thumbnail: 'h-20 w-20 rounded',
    card: 'h-32 rounded-lg',
    button: 'h-9 w-24 rounded-md',
    input: 'h-10 rounded-md',
    image: 'h-48 w-full rounded-lg',
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: '',
  }

  const style = {
    width: width || (variantClasses[variant] ? undefined : '100%'),
    height: height || undefined,
  }

  return (
    <div
      className={`
        bg-stone-200 
        ${variantClasses[variant] || ''}
        ${animationClasses[animation]}
        ${className}
      `}
      style={style}
    />
  )
}

/**
 * Skeleton Group Component
 * 
 * A group of skeletons that mimics a list or card layout.
 */
export const SkeletonGroup = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} variant="card" />
      ))}
    </div>
  )
}

/**
 * Table Skeleton Component
 * 
 * A skeleton that mimics a table structure.
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="overflow-hidden border border-stone-200 rounded-lg">
      <table className="min-w-full">
        <thead className="bg-stone-50">
          <tr>
            {[...Array(columns)].map((_, i) => (
              <th key={i} className="px-4 py-3">
                <Skeleton variant="text" width="w-24" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'}>
              {[...Array(columns)].map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton variant="text" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Card Skeleton Component
 * 
 * A skeleton that mimics a summary card.
 */
export const CardSkeleton = () => {
  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-glass">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="text" width="w-20" />
        <Skeleton variant="avatar" />
      </div>
      <Skeleton variant="title" width="w-32" className="mb-2" />
      <Skeleton variant="text" width="w-16" />
    </div>
  )
}

/**
 * Dashboard Skeleton Component
 * 
 * A skeleton that mimics the dashboard layout.
 */
export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton variant="card" className="h-80" />
        <Skeleton variant="card" className="h-80" />
      </div>
      
      {/* Table */}
      <TableSkeleton rows={5} columns={4} />
    </div>
  )
}

export default Skeleton

