import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Toaster } from 'sonner';
import './App.css';
import Routing from './Routing/Routing';
function App() {
    return (_jsxs(_Fragment, { children: [_jsx(Toaster, { richColors: true, position: "top-right" }), _jsx(Routing, {})] }));
}
export default App;
