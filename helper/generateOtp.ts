async function generateOtp() {
  try {
    return `${Math.floor(10000 + Math.random() * 90000)}`;
  } catch (error) {
    throw Error("Something went wrong");
  }
}
export default generateOtp;
