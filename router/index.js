const express = require('express');
const app = express();
const router = express.Router();
const models = require('../model/model');
const User = models.User;
const Spec = models.Spec;
const Fit = models.Fit;
const Exercise = models.Exercise;
const Fat = models.Fat;
const bodyParser = require('body-parser');
const {pearson, similar} = require('../relate');

app.use(bodyParser.json());

function getFits(similar){
    const specs = [];
    similar.forEach(async doc=>{
        const fit = await Fit.findOne({spec:doc.p}).then(results=>{
            return results;
        })
       return specs.push(fit);
    })
    console.log(specs);
    return specs;
}

router.post('/fits',(req, res, next)=>{
    User.findOne({name:req.body.name}).exec().then(results=>{
        const fit = new Fit({
            exercise:req.body.exercise,
            fat:req.body.fat,
            spec:results.spec
        })
        return fit.save().then(results=>{
            res.status(201).json({
                fit:results
            })
        }).catch(err=>{
            res.status(500).json({
                error:err
            })
        })
    })
})

router.post('/newspecs',function(req, res, next){
    User.findOne({email:req.body.email})
    .exec().then(user=>{
        console.log(user);
        const spec = new Spec({
            bmi:req.body.bmi,
            insulin:req.body.insulin,
            glucose:req.body.glucose,
            triceps:req.body.triceps,
            bpressure:req.body.bpressure
        });
        return spec.save()
        .then(async spec=>{
            console.log(spec._id)
            await user.update({$set:{spec:spec._id}});
            res.status(201).json({
                message:"specs added",
                user:user,
                specs:spec
            });
        }).catch(err=>{
            res.status(500).json({
                error:err
            })
        })
    })
})

const data = {
    name:"solomon"
}

router.get('/me',function(req, res, next){
    res.send(data)
})

router.get('/exercise',(req, res, next)=>{
    
})

router.post('/exercise',(req,res,next)=>{
    User.findOne({name:req.body.name}).exec().then(async results=>{
        const spec = await Spec.findOne({_id:results.spec}).then(spec=>{return spec})
        console.log(spec);
        const exercise = new Exercise({
            meters:req.body.meters
        });
        return exercise.save().then(async ex=>{
            console.log(ex)
            const fit = await Fit.findOne({spec:spec._id});
            console.log(fit)
            await fit.update({$set:{exercise:ex._id}})
            res.status(201).json({
                ex
            })
        })
    })
})

router.post('/fat',(req,res,next)=>{
    User.findOne({name:req.body.name}).exec().then(async results=>{
        const Spec  = await Spec.findOne({_id:results.spec}).then(spec=>{return spec});
        const fat = new Fat({
            type:req.body.type
        });
        return fat.save().then(async fa=>{
            const fit = await Fit.findOne({spec:spec._id});
            await fit.update({$set:{fat:ex._id}})
            res.status(201).json({
                fa
            })
        })
    })
})

router.post('/signup',function(req, res, next){
    User.find({ email:req.body.email})
    .exec()
    .then(user=> {
        if(user.length >= 1){
            return res.status(409).json({
                message:'email already exists'
            });
        }else{
            const user = new User({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                bio:req.body.bio
              });
              return user.save()
              .then(result =>{
                console.log(result);
                res.status(201).json({
                  message:"user created",
                  email:req.body.email,
                  id:result._id
                });
              })
              .catch(err=>{
                res.status(500).json({
                  error:err
                });
              });
        }
    })
  });

  router.get('/specs/:name', (req, res)=>{
      const name = req.params.name;
      return User.findOne({name:name}).then(results=>{
          const id= results.spec;
          return Spec.find({},{__v:0}).exec().then(async results=>{
            var dataset = results.reduce((o, a)=> 
              Object.assign(o,{[a._id]:{bmi:a.bmi,insulin:a.insulin,glucose:a.glucose,triceps:a.triceps,bpressure:a.bpressure}}),{}
            );
            const dataset2 = await JSON.stringify(dataset);
            const dataset3 = await JSON.parse(dataset2)
            const similar7  =await  similar(dataset3,id,1,pearson);
            return similar7[0];
        }).then(returned=>{
            Fit.findOne({spec:returned.p}).then(snap=>{
                console.log(snap);
                res.status(200).json({
                    snap
                })
            })
        })
      })
  })

  /*router.get('/specs/:name', (req, res)=>{
    const name = req.params.name;
    return User.findOne({name:name}).then(results=>{
        const id= results.spec;
        return Spec.find({},{__v:0}).exec().then(async results=>{
          var dataset = results.reduce((o, a)=> 
            Object.assign(o,{[a._id]:{bmi:a.bmi,insulin:a.insulin,glucose:a.glucose,triceps:a.triceps,bpressure:a.bpressure}}),{}
          );
          const dataset2 = await JSON.stringify(dataset);
          const dataset3 = await JSON.parse(dataset2)
          const similar7  =await  similar(dataset3,id,1,pearson);
          return similar7
      }).then(returned=>{
          const rets = [];
          returned.map(ret=>{
              const p = Fit.findOne({spec:ret.p}).then(async noe=>{
                  return  noe;
              })
              rets.push(p)
          })
          return Promise.all(rets);
      })
      .then(gotsnaps=>{
          const gots = [];
          gotsnaps.forEach(snap=>{
              gots.push(snap)
          })
          res.status(200).json({
              results:gots
          })
      })
    })
})*/

  router.get('/fit/:specId',(req,res)=>{
      const specId = req.params.specId;
      return Fit.findOne({spec:specId}).then(results=>{
          res.status(200).json({
              fits:results
          })
      })
  })

  router.get('/users', (req, res)=>{
      return User.find().exec().then(results=>{
          const users = [];
          results.forEach(element => {
              users.push({
                  
              })
          });
          const users1 = {...users};
          console.log(users1)
          res.status(200).json({
              users1
          })
      })
  })

  router.get('/user/:name',(req, res, next)=>{
    console.log(req.params)
    return User.findOne({name:req.params.name})
    .exec().then(async results=>{
        const specId = results.spec;
        const specs =  await Spec.findOne({_id:specId}).then(results=>{
            return results
        })
        const fits = await Fit.findOne({spec:specId}).then(results=>{
            return results;
        })
        res.status(200).json({
            specs:specs,
            fits:fits
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
  })


module.exports = router;