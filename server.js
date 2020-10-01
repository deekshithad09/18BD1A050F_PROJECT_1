const express=require('express');
const bodyparser=require('body-parser');
let jwt=require('jsonwebtoken');
let config=require('./config');
let middleware=require('./middleware');
let app=require('./index.js');


class HandlerGenerator{
    login(req,res){
        let username=req.body.username;
        let password=req.body.password;

        let mockuser='admin';
        let mockpassword='Kmit';

        if(username && password)
        {
            if(username===mockuser && mockpassword===password)
            {
                let token=jwt.sign({username: username},
                config.secret,
                {
                    expiresIn :'24h'
                });
                res.json({
                    success:true,
                    message:'Authentication successful',
                    token:token
                }
                );
            }else{
                res.json({
                    success:false,
                    message:'Incomplete username or password'
                });
            }
        }else{
            res.json(
                {
                    success:false,
                    message:'Authentication failed please check request'
                }
            );
        }
    }


    testFunction(req,res)
    {
    res.json(
        {
            success:true,
            message:'Testing successful'
        }
    );
    }
}



function main()
{
    let app=express();
    let handlers=new HandlerGenerator();
    const port=100;
    app.use(bodyparser.urlencoded({
      extended:true
    }));
    app.use(bodyparser.json());

    app.post('/login',handlers.login);
    app.get('/',middleware.checkToken,handlers.testFunction);

    app.listen(port,()=>console.log(`Server is listening on port: ${port}`));

}
main();