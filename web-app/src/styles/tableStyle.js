import {  createTheme } from '@mui/material/styles';
import { FONT_FAMILY } from 'common/sharedFunctions';

const theme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
        selectLabel: {
          fontFamily: FONT_FAMILY,
        },
        displayedRows: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    
  
  },
});

export default theme;