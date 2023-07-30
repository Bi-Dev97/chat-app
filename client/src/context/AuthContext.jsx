/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/service";

/**The AuthContext (context's api) will be make user's data accessible globally
 * in our app's tree instead of passing them as props
 * through component before using these data    */
export const AuthContext = createContext();

/**AuthContextProvider contains user's data
 * we want to shared or to be accessible globally
 *  and when we will pass AuthContext in useContext
 * we will be able to access to user's data provided
 *  by the AuthContextProvider  */
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  /**We can manage the registerInfo's state locally it means
   * in register's component because register's data is don't
   * needed globally */
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("User");
    setUser(JSON.parse(user));
  }, []);

  /**By using useCallback, you can optimize the performance of your
   * React components by avoiding unnecessary function recreations
   * and re-renders. It's particularly useful when passing callbacks
   *  to child components, as it ensures that child components
   * only re-render when necessary. */
  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  /**As we call this function below when an event occurs
   * in this case when client submit the form he will have
   *  access to the event's object */
  const registerUser = useCallback(
    async (e) => {
      /**We use the event(e)'s object to
       * prevent the form for refreshing the page */
      e.preventDefault();

      /**Before we get a response after the request
       * it may take some time so the request is in loading
       * Then we set the loading's status to true */
      setIsRegisterLoading(true);

      /**At the beginning of the request
       * we don't have errors so we set null for errors */
      setRegisterError(null);

      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );

      /**After getting the response we set
       * loading to false because our request has stop happening*/
      setIsRegisterLoading(false);

      /**Here we check if the error's property exists in the
       *  response's object according to our postRequest's function */
      if (response.error) {
        return setRegisterError(response);
      }

      // Save the user in the localStorage so when we refresh the page we will get back the user
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  ); /**This will return either an error or
   data as defined according to the postRequest's function.
    Here we set in deps's array registerInfo so when 
    registerInfo changes useCallback will trigger the 
    callback and get the updated data given by the client in the form;
     if the deps's array is empty the callback will 
    be triggered only on the first render and then the function
     will get initial values which are empty   */

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();

      setIsLoginLoading(true);
      setLoginError(null);

      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );
      setIsLoginLoading(false);
      if (response.error) {
        return setLoginError(response);
      }

      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [loginInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginUser,
        loginError,
        loginInfo,
        isLoginLoading,
        updateLoginInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
