// Configuration for error bar column mappings from spreadsheet
export type ErrorBars = {
  enabled: boolean
  defaultStyles?: ErrorBarStyles // Optional: if different from the default style
  categories?: {
    [key: string]: {
      category: string // Category name (e.g., 'Democrats', 'Republicans')
      categoryColumn: string // Column name that contains the category for point estimate
      lowColumn: string // Column name for the low end of error bar
      highColumn: string // Column name for the high end of error bar
      pointEstimateColumn?: string // Optional: if different from the main y column
      styles?: ErrorBarStyles // Optional: if different from the default style
    }
  }
}

export type ErrorBarStyles = {
  strokeWidth: number
  stroke: string
  strokeOpacity: number
  strokeDasharray: string
}

// Individual error bar for a specific category
export type ErrorBarItem = {
  low: number
  high: number
  category: string
  pointEstimate?: number // Optional: if this error bar has its own point estimate
}
