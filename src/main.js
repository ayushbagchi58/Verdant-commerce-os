import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
createRoot(document.getElementById('root')).render(_jsx(Router, { children: _jsx(StrictMode, { children: _jsx(App, {}) }) }));
