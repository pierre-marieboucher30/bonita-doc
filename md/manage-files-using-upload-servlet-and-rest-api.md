# Upload servlets for the REST API expecting files 

For all the REST APIs expecting a file path it is required to upload the file using one of the provided upload servlets first.  

To upload a file you need to perform a multipart post request on any of the available servlets.
It returns the name of the temporary uploaded file.
This file name can be used to link those files with any REST resources.

## Available servlets

* `/portal/fileUpload`, supports any type of files
* `/portal/processUpload`, supports only `.bar` files
* `/portal/organizationUpload`, supports only `.xml` files
* `/portal/actorsUpload`, supports only `.xml` files
* `/portal/imageUpload`, supports only `.png`, `.jpg`, `.gif`, `.jpeg`, `.bmp`, `.wbmp` or `.tga` files
* `/portal/pageUpload`, supports only `.zip` files
* `/portal/applicationsUpload`, supports only `.xml` files
* `/portal/connectorImplementation`, supports only `.zip` files (not available in Community edition)
* `/portal/reportUpload`, supports any type of file (not available in Community edition)
* `/portal/resourceUpload`, supports only `.jar` files (not available in Community edition)
* `/portal/profilesUpload`, supports only `.xml` files (not available in Community edition)
* `/API/formFileUpload`, supports any type of files, used to upload a file before submitting a process or task form with a document in its contract

::: info
**Note:** For `/API/formFileUpload`, you indeed need to pass the [CSRF token](csrf-security.md) in the request. It is expected to be present as one of the form data of the request (contrary to the REST API which expects it in the request headers). The name of this form-data needs to be "CSRFToken" and the value, the content of the X-Bonita-API-Token cookie.
:::

## Example

You can refer to the [example-upload-servlet](https://github.com/Bonitasoft-Community/example-upload-sevlet) project that demonstrate the two use cases explained below.


### Link an icon to a new organization group

1. Call the login service: `/bonita/loginservice` for authentication.
1. Upload an image by using a multipart post request on the image upload servlet, `/bonita/portal/imageUpload`.
1. The image is stored in a temporary folder.
1. The servlet call response includes the name of the temporary file.
1. Call the Identity API to create a new group: `/bonita/API/identity/group`, link this image to the group by specifying this temporary file name in the request body.

### Deploy programmatically a new REST API extension

1. Call the login service: `/bonita/loginservice` for authentication.
1. Upload a REST API extension by using a multipart post request on the page upload servlet: `/bonita/portal/pageUpload`. It will send the REST API extension (handle as a "page") zip file from client side to server side.
1. REST API extension zip file is stored in a temporary folder.
1. The servlet call response includes the name of the temporary file.
1. Call the Portal API to register the newly uploaded REST API extension: `/bonita/API/portal/page`.
