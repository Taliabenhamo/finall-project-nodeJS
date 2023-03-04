const JOI=require('joi')


function validate(user){
    const schema=JOI.object({
        username:JOI.string().required().min(2).max(30),
        email:JOI.string().required().min(6),
        password:JOI.string().required().min(8).max(50),
        biz:JOI.boolean()
    });
    return schema.validate(user);
};

exports.validate=validate
