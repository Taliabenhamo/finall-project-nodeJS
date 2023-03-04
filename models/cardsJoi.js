const JOI=require('joi')



function validate(card) {
    const schema = JOI.object({
      Name: JOI.string().min(2).max(100).required(),
      Description: JOI.string().min(3).max(1000).required(),
      Address: JOI.string().min(5).max(250).required(),
      Phone: JOI.string().min(8).required(),
      Image: JOI.string().min(10),
    });
    return schema.validate(card);
  }

  exports.validate=validate;
