declare module "react-date-range" {
  import React from "react";

  export interface Range {
    startDate: Date;
    endDate: Date;
    key: string;
    color?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    showDateDisplay?: boolean;
  }

  export interface DateRangeProps {
    ranges: Range[];
    onChange: (ranges: { [key: string]: Range }) => void;
    editableDateInputs?: boolean;
    moveRangeOnFirstSelection?: boolean;
    retainEndDateOnFirstSelection?: boolean;
    showSelectionPreview?: boolean;
    showDateDisplay?: boolean;
    showMonthAndYearPickers?: boolean;
    showMonthArrow?: boolean;
    months?: number;
    direction?: "vertical" | "horizontal";
    rangeColors?: string[];
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[];
    disabledDay?: (date: Date) => boolean;
    scroll?: {
      enabled: boolean;
      monthHeight?: number;
      longMonthHeight?: number;
      monthWidth?: number;
      calendarWidth?: number;
      calendarHeight?: number;
    };
    locale?: any;
    className?: string;
    dateDisplayFormat?: string;
    dayDisplayFormat?: string;
    weekdayDisplayFormat?: string;
    monthDisplayFormat?: string;
    focusedRange?: [number, number];
    onRangeFocusChange?: (focusedRange: [number, number]) => void;
    initialFocusedRange?: [number, number];
    preventSnapRefocus?: boolean;
    calendarFocus?: "forwards" | "backwards";
    startDatePlaceholder?: string;
    endDatePlaceholder?: string;
    showPreview?: boolean;
    preview?: Range;
    ariaLabels?: {
      dateInput?: {
        startDate?: string;
        endDate?: string;
      };
      monthPicker?: string;
      yearPicker?: string;
      prevButton?: string;
      nextButton?: string;
    };
  }

  export class DateRange extends React.Component<DateRangeProps> {}
}
