/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axiosInstance"; // Adjust the path as needed

export const checkCarAvailability = async (
  id: number | null | undefined, // Allow id to be number, null, or undefined
  carId: number,
  startDate: string,
  endDate: string
) => {
  try {
    console.log("Request parameters:", { id, carId, startDate, endDate });

    // Build the params object, including id only if it's defined (and not null)
    const params: { [key: string]: any } = { carId, start: startDate, end: endDate };
    if (id !== null && id !== undefined) {
      params.id = id;
    }

    // Make the API call using the axios instance
    const response = await axiosInstance.get(`/rentals/check-availability`, {
      params,
    });

    const data = response.data;

    if (data.available) {
      // Car is available
      return true;
    } else {
      // Car is not available
      console.log(data.message); // Log or show the message to the user
      return false;
    }
  } catch (error) {
    console.error("Error checking car availability:", error);
    return false;
  }
};
