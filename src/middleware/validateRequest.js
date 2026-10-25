import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

export function validateRequest(req, _res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const details = result.array().map(({ path, param, msg, location }) => ({
      field: path ?? param,
      location,
      message: msg
    }));
    return next(new ApiError(400, "Validation failed", details));
  }
  next();
}

export function onlyAllowedBodyFields(allowedFields) {
  return (req, _res, next) => {
    const body = req.body;
    if (body === undefined || body === null || typeof body !== "object" || Array.isArray(body)) {
      return next(new ApiError(400, "Request body must be a JSON object"));
    }

    const unknownFields = Object.keys(body).filter((key) => !allowedFields.includes(key));
    if (unknownFields.length) {
      return next(new ApiError(400, "Request contains unsupported fields", unknownFields.map((field) => ({ field, message: "Field is not allowed" }))));
    }
    next();
  };
}

export function requireAtLeastOneBodyField(req, _res, next) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Provide at least one field to update"));
  }
  next();
}
