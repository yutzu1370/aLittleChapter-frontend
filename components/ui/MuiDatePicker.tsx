"use client"

import * as React from 'react';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import {
  PickersLayoutProps,
  usePickerLayout,
  pickersLayoutClasses,
  PickersLayoutRoot,
  PickersLayoutContentWrapper,
} from '@mui/x-date-pickers/PickersLayout';

// 設定 dayjs 語言為繁體中文
dayjs.locale('zh-tw');

interface MuiDatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  onClose?: () => void;
}





function CustomLayout(props: PickersLayoutProps<Dayjs | null>) {
  const { content, ownerState } = usePickerLayout(props);

  return (
    <PickersLayoutRoot
      ownerState={ownerState}
      sx={{
        overflow: 'hidden',
        borderRadius: '12px',
        border: '2px solid #E5E5E5',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        fontFamily: 'Noto Sans TC, sans-serif',
        width: '320px',
        height: 'auto',
        // 自定義日曆樣式
        '& .MuiDayCalendar-root': {
          fontFamily: 'Noto Sans TC, sans-serif',
          overflow: 'hidden',
        },
        '& .MuiPickersDay-root': {
          fontFamily: 'Noto Sans TC, sans-serif',
          '&:hover': {
            backgroundColor: '#E8652B20',
          },
          '&.Mui-selected': {
            backgroundColor: '#E8652B',
            '&:hover': {
              backgroundColor: '#D94A1D',
            },
          },
        },
        '& .MuiPickersCalendarHeader-root': {
          fontFamily: 'Noto Sans TC, sans-serif',
        },
        '& .MuiPickersCalendarHeader-labelContainer': {
          fontFamily: 'Noto Sans TC, sans-serif',
          color: '#2F726D',
          fontWeight: 600,
        },
        '& .MuiPickersArrowSwitcher-button': {
          color: '#E8652B',
          '&:hover': {
            backgroundColor: '#E8652B20',
          },
        },
        '& .MuiDayCalendar-weekDayLabel': {
          fontFamily: 'Noto Sans TC, sans-serif',
          color: '#666',
          fontWeight: 500,
        },
        // 隱藏滾動條
        '& .MuiPickersLayout-contentWrapper': {
          overflow: 'hidden',
        },
      }}
    >
      <PickersLayoutContentWrapper
        className={pickersLayoutClasses.contentWrapper}
        ownerState={ownerState}
      >
        {content}
      </PickersLayoutContentWrapper>
    </PickersLayoutRoot>
  );
}

export default function MuiDatePicker({ value, onChange, onClose }: MuiDatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(
    value ? dayjs(value) : dayjs()
  );

  const handleDateChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
    if (onChange) {
      onChange(newValue ? newValue.toDate() : null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
      <StaticDatePicker
        value={selectedDate}
        onChange={handleDateChange}
        slots={{
          layout: CustomLayout,
        }}
        maxDate={dayjs()}
        minDate={dayjs('1900-01-01')}
      />
    </LocalizationProvider>
  );
}