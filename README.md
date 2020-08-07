# Introduction
This small Express/MongoDB boilerplate enable you to scaffold express API server more easier.

## Feature
- Default scaffold authenticated system (ACL) using jwt token base.
- Model and controller implementation make easier.
- Currently only support mongodb so please install your MongoDB server on your local machine before setup project.

## Installation

Just clone the project
```
git clone https://github.com/duykieu/umi9-scaffold.git
```

Install dependencies
```
npm install
```

Install `nodemon` globally

```
npm install -g nodemon
```

Starting your server
```
npm start
```

## Using
Run `npm link`, After that you can use `umi9` command without node prefix (Windows user may need to use `node umi9.js` instead.

### Seeding first acl system
This action create user_groups collection in our database and put basic permissions to permissions array, you can view acl system file in `acl/permissions.js`
```
umi9 seed:acl
```

### Creating super user
```
umi9 make:superuser
```

### Making some model
```
umi9 make:model Product --fields=name:String,slug:String //Basic
umi9 make:model Collection --fields=name:String#required-minLength:5-maxLength:100,slug:String#unique //Specifying rule
```

### Making controller
```
umi9 make:controller ProductController Product //Both controller name and model name are required
```

*Have a look at `.env` file*

## Credit
Thank to Jonas, who owns the course !(https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/)[Node.js, Express, MongoDB & More: The Complete Bootcamp 2020] which help me make this project
