import { useState } from 'react';
import { subDays } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@radix-ui/react-select';

interface DateSelectorProps {
  onChange: (range: { startDate: Date; endDate: Date }) => void;
}

export const DateSelector = ({ onChange }: DateSelectorProps) => {
  const [range, setRange] = useState('7');

  const handleChange = (value: string) => {
    setRange(value);
    const endDate = new Date();
    let startDate: Date;
    switch (value) {
      case '7':
        startDate = subDays(endDate, 7);
        break;
      case '30':
        startDate = subDays(endDate, 30);
        break;
      case '90':
        startDate = subDays(endDate, 90);
        break;
      default:
        startDate = subDays(endDate, 7);
    }
    onChange({ startDate, endDate });
  };

  return (
    <Select onValueChange={handleChange} defaultValue={range}>
      <SelectTrigger className="w-[180px] border rounded-md p-2">
        Last {range} days
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7">Last 7 days</SelectItem>
        <SelectItem value="30">Last 30 days</SelectItem>
        <SelectItem value="90">Last 90 days</SelectItem>
      </SelectContent>
    </Select>
  );
};