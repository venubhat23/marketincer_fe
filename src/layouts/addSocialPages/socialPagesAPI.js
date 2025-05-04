import AxiosManager from '../../axiosManager';

async function fetchLinkedInProfile(code, redirectUri) {
  try {
    const paylod = {
        code: code,
        redirect_uri: redirectUri,
    };
    console.log('Payload:', paylod);
    const response = await AxiosManager.post('/api/v1/linkedin/exchange-token', paylod);
    console.log('Access Token:', response);
    const accessToken =  response.data.accessToken;
    if (accessToken) {
        // Store the access token in localStorage
        localStorage.setItem("linkedin_access_token", accessToken);

    //     // Proceed with fetching the LinkedIn accounts
    //     // fetchAccountsFromAPI(accessToken);
    }
  } catch (error) {
    console.error('Failed to fetch LinkedIn access token:', error);
    throw error;
  }
}

export default fetchLinkedInProfile;
