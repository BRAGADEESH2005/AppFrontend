import Backdrop from '@mui/material/Backdrop';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useMemo, useState } from 'react';
import { Problem } from '../../../utils/types';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';
import ProblemsTable from './ProblemsTable';
import { Link } from 'react-router-dom';
import { difficultyColors } from '../../../constants/Index';
import { isAccepted, isRejected } from '../../../utils/helpers';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import { useUserSlice } from '../../../store/user';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { capitalize, SelectChangeEvent } from '@mui/material';
import { useAuthContext } from '../../../context/AuthContext';
import { useProblemSlice } from '../../../store/problemSlice/problem';
import useDebounce from '../../../hooks/useDebounce';

export default function ProblemsSet() {
  const [open, setOpen] = useState<boolean>(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { isError, isLoading, error } = useAuthContext();
  const problems = useProblemSlice((state) => state.problems);
  const setProblems = useProblemSlice((state) => state.setProblems);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const handleClose = () => {
    setOpen(false);
  };
  const columnHelper = createColumnHelper<Problem>();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const user = useUserSlice((state) => state.user);
  // Fetch problems when the component mounts
  useEffect(() => {
    console.log('fetching problems', import.meta.env.VITE_API_BASE_URL);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/problems`)
      .then((response) => {
        console.log('response789789', response.data.data);
        setProblems(response.data.data); // Update Zustand store
        console.log('Updated Zustand problems:', useProblemSlice.getState().problems);
      })
      .catch((error) => {
        console.error('Error fetching problems:', error);
      });
  }, [setProblems]);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.status, {
        id: 'Status',
        cell: (info) => {
          let icon;
          if (user) {
            icon = isAccepted(info.row.original._id, user?.submissions) ? (
              <TaskAltOutlinedIcon titleAccess='Solved' color='success' />
            ) : isRejected(info.row.original._id, user?.submissions) ? (
              <PendingOutlinedIcon titleAccess='Attempted' color='warning' />
            ) : null;
          } else {
            icon = null;
          }
          return <div> {icon}</div>;
        },
        filterFn: 'statusFilter' as any,
      }),
      columnHelper.accessor((row) => row.title, {
        id: 'Title',
        cell: (info) => {
          return (
            <Link to={`/problems/${info.row.original._id}${info.row.index + 1}`}>
              {info.row.index + 1}. {info.getValue()}
            </Link>
          );
        },
        filterFn: 'titleFilter' as any,
      }),
      columnHelper.accessor((row) => row.difficulty, {
        id: 'Difficulty',
        cell: (info) => {
          return <div style={{ color: difficultyColors[info.getValue()] }}>{capitalize(info.getValue())}</div>;
        },
        filterFn: 'difficultyFilter' as any,
      }),
    ],
    [user]
  );
  
  const table = useReactTable({
    data: problems ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
    filterFns: {
      difficultyFilter: (row, columnId, filterValue) => {
        if (filterValue === 'all') {
          return row;
        }
        const column = columnId.toLowerCase();
        const value = filterValue ? row.original[column] === filterValue : row.original[column];
        return value;
      },
      titleFilter: (row, columnId, filterValue) => {
        const column = columnId.toLowerCase();
        console.log(row.original[column], filterValue);
        const value = row.original[column].toLowerCase().includes(filterValue.toLowerCase());
        return value;
      },
      statusFilter: (row, _columnId, filterValue) => {
        const acceptedProblems = [
          ...new Set(user?.submissions.filter((s) => s.status === 'Accepted').map((s) => s.problemId)),
        ];
        const rejectedProblems = [
          ...new Set(user?.submissions.filter((s) => s.status === 'Wrong Answer').map((s) => s.problemId)),
        ];
        const onlyRejectProblems = rejectedProblems.filter((id) => !acceptedProblems.includes(id));
        if (filterValue === 'solved') {
          return acceptedProblems?.includes(row.original._id);
        } else if (filterValue === 'attempted') {
          return onlyRejectProblems?.includes(row.original._id);
        } else if (filterValue === 'todo') {
          return !onlyRejectProblems?.includes(row.original._id) && !acceptedProblems.includes(row.original._id);
        }
        return true;
      },
    },
  });

  console.log('table12345', table);
  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setDifficultyFilter(event.target.value);
    table.getColumn('Difficulty')?.setFilterValue(event.target.value);
  };
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    table.getColumn('Status')?.setFilterValue(event.target.value);
  };

  const handleQueryChange = (queryvalue: string) => {
    setSearchQuery(queryvalue);
  };

  useEffect(() => {
    table.getColumn('Title')?.setFilterValue(debouncedSearchQuery);
  }, [debouncedSearchQuery]);
  // Add this after your table declaration
  useEffect(() => {
    console.log('problems123455---', problems);
    if (problems) {
      // Create a new options object with updated data
      console.log('table.options----------', table.options);
      const newOptions = {
        ...table.options,
        data: problems,
      };

      // Update the table options
      table.setOptions(newOptions);

      // Verify the table update worked
      console.log('Table updated with problems:', {
        problemsCount: problems.length,
        tableRowCount: table.getRowModel().rows.length,
      });
    }
  }, [problems, table]);

  if (isLoading) {
    return (
      <>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </>
    );
  }

  if (isError) {
    return <p>{error?.message}</p>;
  }

  return (
    <>
      {console.log('problems---', problems)}
      <ProblemsTable
        handleStatusChange={handleStatusChange}
        difficultyFilter={difficultyFilter}
        statusFilter={statusFilter}
        handleDifficultChange={handleDifficultyChange}
        table={table}
        data={problems}
        searchQuery={searchQuery}
        handleQueryChange={handleQueryChange}
        clear={() => {
          setSearchQuery('');
        }}
        reset={() => {
          setSearchQuery('');
          setStatusFilter('all');
          setDifficultyFilter('all');
          table.getColumn('Difficulty')?.setFilterValue('all');
          table.getColumn('Status')?.setFilterValue('all');
        }}
      />
    </>
  );
}
