// import { Component } from "react";
import axios from 'axios';
// import React, { useEffect, useState } from 'react';
import config from "../config.json"

const { SERVER_API } = config;

// Tạo instance của Axios
const api = axios.create({
  baseURL: `${SERVER_API}`,
  timeout: 10000, // Thời gian chờ 10 giây
  headers: { 'Content-Type': 'application/json' }
});

// api liên hệ (contact)
export const contact = (name, mail, subject, message) => {
    return api.post(`/add-contact.php?name=${name}&email=${mail}&subject=${subject}&message=${message}`);
};

export const getAllInfoContact = () => {
  return api.post(`/admin/contact-details.php`);
};