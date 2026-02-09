import { NavLink, Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import './styles.css'
import React from "react";
import ResponsiveAppBar from "./NavBar";

export default function Layout() {
    
    return <>
        <header><ResponsiveAppBar /></header>
        <main>
            <Outlet /></main>
        <footer></footer>
    </>
}