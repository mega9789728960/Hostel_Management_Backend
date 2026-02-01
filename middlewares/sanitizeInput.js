// middlewares/sanitizeInput.js
import sanitizeHtml from "sanitize-html";

function sanitizeObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = sanitizeHtml(obj[key], {
        allowedTags: [],
        allowedAttributes: {},
      });
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

export default function sanitizeInput(req, res, next) {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
}
