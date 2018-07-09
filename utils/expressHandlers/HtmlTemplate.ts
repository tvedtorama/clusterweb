/** Simple HTML document for use with simple react apps, loads the common chunk (vendor) and a custom (login) bundle.  ATW: Used for the login form. */
export const htmlTemplate = ({ body, title, bundleName }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <script type="text/javascript">
        window.initialReactProps = {lang:"no"}
      </script>
      <title>${title}</title>
    </head>
    <body>
      <div id="top">${body}</div>
      <script src="/static/vendor_bundle.js"></script>
      <script src="/static/${bundleName}_bundle.js"></script>
    </body>
  </html>
`;
