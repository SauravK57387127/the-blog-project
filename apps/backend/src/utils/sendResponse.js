// '=' means object destructuring in function parameters

// export const sendResponse = ({ res, statusCode = 200, success = true, message = 'OK', data = null }) => {       
//     return res.status(statusCode).json({
//       success,
//       message,
//       data,
//     });
//   };
    
export const sendResponse = ({
  res,
  statusCode = 200,
  success = true,
  message = 'OK',
  data = null,
  errors = null,
  meta = null
}) => {
  if (typeof message !== 'string') message = String(message);
  if (typeof data === 'undefined') data = null;

  return res.status(statusCode).json({
    success,
    message,
    data,
    ...(errors && { errors }),
    ...(meta && { meta })
  });
};
