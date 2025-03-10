import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { styled } from "@mui/system";
import { NavLink } from "react-router-dom";

const StyledNavLink = styled(NavLink)(() => ({
  textDecoration: "none",
  color: "inherit",
}));

export default function Navbar() {
  return (
    <Box>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <StyledNavLink to="/">
            <h1>Solar Facility Monitoring System</h1>
          </StyledNavLink>

          <StyledNavLink to="/create">
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: "medium",
                borderColor: "divider",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              Create Facility
            </Button>
          </StyledNavLink>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
