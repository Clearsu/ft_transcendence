const fetchRequest = async (url, requestOptions) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api${url}`,
      requestOptions
    );
    const contentType = response.headers.get("Content-Type");

    if (!response.ok) {
      const errorResponse = await response.json();
      const error =
        (errorResponse && errorResponse.message) || response.statusText;
      throw new Error(error);
    }

    return contentType && (await response.json());
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

const get = async (url) => {
  const requestOptions = {
    method: "GET",
  };
  return fetchRequest(url, requestOptions);
};

const post = async (url, body) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return fetchRequest(url, requestOptions);
};

const put = async (url, body) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return fetchRequest(url, requestOptions);
};

const deleteRequest = async (url) => fetchRequest(url, { method: "DELETE" });

const fetchAPI = {
  get,
  post,
  put,
  delete: deleteRequest,
};

export default fetchAPI;
