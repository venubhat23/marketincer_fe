import AxiosManager from '../../axiosManager';

async function fetchLinkedInProfile(code, redirectUri, type) {
  try {
    const paylod = {
        code: code,
        redirect_uri: redirectUri,
        type: type,
    };
    console.log('Payload:', paylod);
    const response = await AxiosManager.post('/api/v1/linkedin/exchange-token', paylod);
    console.log('Access Token:', response);
    const data =  response.data;
    if (data.status == "success") {
        // Store the access token in localStorage
        localStorage.setItem("linkedin_access_token", data["accessToken"]);

    //     // Proceed with fetching the LinkedIn accounts
    //     // fetchAccountsFromAPI(accessToken);
    }
    return data;
  } catch (error) {
    console.error('Failed to fetch LinkedIn access token:', error);
    throw error;
  }
}

export default fetchLinkedInProfile;
