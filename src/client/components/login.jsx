import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [login, setLogin] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const navigate = useNavigate()
  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setLogin(prevLogin => ({
      ...prevLogin,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if(login.username === 'Destiny' && login.password === 'Destiny001') {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/Dashboard')
    }
  }

  return (
    <>
      <div>
        <header>
          <h1 className="border-b font-bold text-4xl py-2 bg-slate-700 text-white pl-10">TELEGRAM BOT ADMIN PANEL</h1>
        </header>
        <div className="mx-6 lg:mx-60 ">
          <div>
            <h1 className="mt-10 border-b font-semibold text-3xl">Login</h1>
            <hr />
            <div className="mx-4 mt-10 lg:mx-48">
              <form onSubmit={handleSubmit}>
                <label htmlFor="username">
                  <span className="font-bold">Username:</span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={login.username}
                    onChange={handleChange}
                    className="border w-80 h-10 border-black rounded-md ml-8 mb-8"
                  />
                </label>
                <br />
                <label htmlFor="password">
                  <span className="font-bold">Password:</span>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={login.password}
                    onChange={handleChange}
                    className="border w-80 h-10 border-black rounded-md ml-9 mb-6"
                  />
                </label>
                <br />
                <div className="mx-4 lg:mx-28">
                  <div className="flex">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      id="rememberMe"
                      checked={login.rememberMe}
                      onChange={handleChange}
                      className="h-8 w-5 ml-1"
                    />
                    <p className="ml-6 text-xl">Remember Me</p>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="flex justify-end items-end mr-6 bg-slate-700 text-white mt-10 font-bold rounded-md px-2 text-2xl">
                      Login
                    </button>
                  </div>
                  <p className="text-green-500 mt-10 text-center">reset password</p>
                </div>
              </form>
            </div>
          </div>
        </div>
        <footer className="mx-6 lg:mx-64 mt-52">
          <hr />
          <p className="mt-8 text-center text-slate-700">Copyright © 2016-2024 Webhook ApS<span className="ml-10">VAT ID DK41561718</span></p>
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <p className="text-center mt-4">made by othello === telegram: @jakalaka4</p>
        </footer>
      </div>
    </>
  );
}

export default Login;
