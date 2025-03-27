import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

export default function ProblemTypeFilter({
  value,
  handleChange,
}: {
  value: string;
  handleChange: (event: SelectChangeEvent) => void;
}) {
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
      <InputLabel id='problem-type-select-small-label'>Problem Type</InputLabel>
      <Select
        labelId='problem-type-select-small-label'
        id='problem-type-select-small'
        value={value}
        label='Problem Type'
        onChange={handleChange}
      >
        <MenuItem value='all'>All</MenuItem>
        <MenuItem value='array'>Array</MenuItem>
        <MenuItem value='string'>String</MenuItem>
        <MenuItem value='dynamic-programming'>Dynamic Programming</MenuItem>
      </Select>
    </FormControl>
  );
}