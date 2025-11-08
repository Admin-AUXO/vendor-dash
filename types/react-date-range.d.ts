declare module 'react-date-range' {
  import { Locale } from 'date-fns';

  export interface Range {
    startDate?: Date;
    endDate?: Date;
    key?: string;
    color?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    showDateDisplay?: boolean;
  }

  export interface RangeKeyDict {
    selection: Range;
    [key: string]: Range;
  }

  export interface DateRangeProps {
    ranges?: Range[];
    onChange?: (ranges: RangeKeyDict) => void;
    onRangeChange?: (ranges: RangeKeyDict) => void;
    months?: number;
    direction?: 'horizontal' | 'vertical';
    locale?: Locale;
    showMonthAndYearPickers?: boolean;
    showDateDisplay?: boolean;
    showSelectionPreview?: boolean;
    moveRangeOnFirstSelection?: boolean;
    retainEndDateOnFirstSelection?: boolean;
    editableDateInputs?: boolean;
    dragSelectionEnabled?: boolean;
    dateDisplayFormat?: string;
    monthDisplayFormat?: string;
    weekdayDisplayFormat?: string;
    rangeColors?: string[];
    className?: string;
    classNames?: Record<string, string>;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[];
    disabledDay?: (date: Date) => boolean;
    initialFocusedRange?: [number, number];
    focusedRange?: [number, number];
    onRangeFocusChange?: (focusedRange: [number, number]) => void;
    preview?: {
      startDate?: Date;
      endDate?: Date;
    };
    showPreview?: boolean;
    staticRanges?: any[];
    inputRanges?: any[];
    scroll?: {
      enabled?: boolean;
      monthHeight?: number;
    };
    dayContentRenderer?: (date: Date) => React.ReactNode;
    dayDisplayFormat?: string;
    weekdayDisplayFormat?: string;
    fixedHeight?: boolean;
    calendarFocus?: 'forwards' | 'backwards';
    preventSnapRefocus?: boolean;
    updateRange?: (range: Range) => void;
  }

  export class DateRange extends React.Component<DateRangeProps> {}
}

