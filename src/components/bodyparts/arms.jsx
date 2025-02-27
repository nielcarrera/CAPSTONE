import React from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import BodyPartNav from "../bodypartnav";

const arms = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 ml-[280px]">
      <Sidebar></Sidebar>
      <Navbar></Navbar>
      <div className="mt-20">
        <BodyPartNav></BodyPartNav>
        <div>
          <h1 className="mt-50 text-5xl">ARM</h1>
        </div>
      </div>
    </div>
  );
};

export default arms;
