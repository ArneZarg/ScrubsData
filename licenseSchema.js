import * as Yup from "yup";

const licenseValidate = Yup.object().shape({
  licenseNumber: Yup.string().required("is Required"),
  licenseStateId: Yup.number().required("is Required"),
  dateExpires: Yup.date().required("is Required")
});

export default { licenseValidate };
