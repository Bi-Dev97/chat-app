/* eslint-disable no-unused-vars */
export const baseUrl = "http://localhost:5000/api";

/**fetch and axios are both popular JavaScript libraries 
used for making HTTP requests in web applications. But here we will use fetch */
/** we specify the URL of the API endpoint where we want to send the POST request 
. The fetch function takes a second argument, an options object, 
where we provide the necessary details for the POST request:
    method: Set to 'POST' to indicate that it's a POST request.
    headers: Specify the content type of the request body. In this case,
     we set it to 'application/json' to indicate that
      we are sending JSON data.
    body: The data to be sent in the request body. We use 
    JSON.stringify() to convert the data object into a JSON string.
After sending the request, we chain a series of then and 
catch methods to handle the response. In the then block,
 we call response.json() to parse the response as JSON. 
 The resulting promise is then resolved with the parsed
  JSON data, which we can handle in the subsequent then block.
   In case of any errors, the catch block will be executed. */
export const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await response.json(); /**In the context of 
  the fetch API in JavaScript, the response.json() 
  method is used to extract the JSON data from the 
  response object returned by a network request. */

  /** Handle Errors before send data as response 
  ok is a property in response to verify the 
  request status as it is succeed or failed if errors.
   And it is the work of response.json() to 
   determine the status(true or false) of ok property*/
  if (!response.ok) {
    let message;
    if (data?.message) {
      /**Here if we have any error coming from the server with status 500..
       these are errors that we can control
        then we will set in message these errors messages which
         we get from data  */
      message = data.message;
    } else {
      /**Here if we have any errors with customized message 
         coming from the client' s ie errors that we have control on
          as errors with status 400 ...
       side then we will set in message these errors messages get as data  */
      message = data;
    }

    return { error: true, message };
  }
  return data;
};

export const getRequest = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    let message = "An error occurred...";
    if (data?.message) {
      message = data.message;
    }
    return { error: true, message };
  }

  return data;
};
