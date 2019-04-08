// libraries
const express = require('express');
// router instance
var router = express.Router();

// process POST
router.post('/', (req, res) => {
  var admissionRequest = req.body;

  // Get a reference to the pod spec
  var object = admissionRequest.request.object;

  console.log(`validating the ${object.metadata.name} pod`);

  var admissionResponse = {
    allowed: false
  };

  var found = false;
  var serviceAccountName = object.spec.serviceAccountName;
  for (var container of object.spec.containers) {
    console.log(`serviceAccountName -> ${serviceAccountName}`);
    console.log(`container.image -> ${container.image}`);
    console.log(`container.name -> ${container.name}`)
    if ( 
        serviceAccountName == "pvc-backup-deployer" && 
        ! container.image.startsWith("dev/backup") 
    ) {
      console.log(`${container.name} is using an admin-only ServiceAccount`);

      admissionResponse.status = {
        status: 'Failure',
        message: `${container.name} is using an admin-only ServiceAccount`,
        reason: `${container.name} is using an admin-only ServiceAccount`,
        code: 401
      };

      found = true;
    };
  };

  if (!found) {
    admissionResponse.allowed = true;
  }

  var admissionReview = {
    response: admissionResponse
  };

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(admissionReview));
  res.status(200).end();
});

// module export
module.exports = router;
