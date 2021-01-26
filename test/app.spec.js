const app = require('../src/app');
const knex = require('knex');
const { DATABASE_URL } = require('../src/config');


describe('App',()=>{

    it('GET/responds with 200 containing "Hello, world!',()=>{
        return supertest(app)
        .get('/')
        .expect(200, 'Hello, world!')
    })

})

describe('Test api endpoints', () => {
    let db;
    before('make knex instance', () => {
        const db =knex({
            client: 'pg',
            connection:DATABASE_URL,
          })
          
          app.set('db',db);
      })

    context(`testing users endpoints`, () => {
      
        it(`/api/users should respond with 200 and a list of users`, () => {
        return supertest(app)
          .get('/api/users')
          .expect(200, [
            {
                "id": 1,
                "username": "divyanat",
                "fullname": "Divya Natarajan"
            },
            {
                "id": 2,
                "username": "dtarg",
                "fullname": "Daenerys Targaryen"
            },
            {
                "id": 3,
                "username": "uragnar",
                "fullname": "Uhtred Ragnarsson"
            },
            { "id": 4, 
            "username": 'bobbrown', 
            "fullname": 'bob brown' 
            }
        ])
      })

      it(`/api/users/1 should respond with 200 and divyanat`, () => {
        return supertest(app)
          .get('/api/users/1')
          .expect(200, 
            {
                "id": 1,
                "username": "divyanat",
                "fullname": "Divya Natarajan"
            },
            )
      })

      it(`/api/users/checkuser/divyanat should respond with 200 and success:true`, () => {
        return supertest(app)
          .post('/api/users/checkuser/divyanat')
          .send({"username": "divyanat", "password": "Genericpass123!"})
          .expect(200, 
            {
                userId: 1
            }
            )
      })

      it(`/api/users/checkuser/divyanat should respond with 200 and success:false`, () => {
        return supertest(app)
          .post('/api/users/checkuser/divyanat')
          .send({"username": "divyanat", "password": "Genericpass123"})
          .expect(200, 
            {
                "success": false,
            }
            )
      })

    })


    context(`/api/posts`, () => {
        it(`should respond with 200 and a list of posts`, () => {
          return supertest(app)
            .get('/api/posts')
            .expect(200, [
                {
                    "id": 1,
                    "user_id": 1,
                    "title": "The Heart of a Woman",
                    "link": "https://www.penguinrandomhouse.com/books/3954/the-heart-of-a-woman-by-maya-angelou/",
                    "by": "Maya Angelou",
                    "content": "In The Heart of a Woman, Maya Angelou leaves California with her son, Guy, to move to New York. There she enters the society and world of black artists and writers, reads her work at the Harlem Writers Guild, and begins to take part in the struggle of black Americans for their rightful place in the world. In the meantime, her personal life takes an unexpected turn.",
                    "post_type": "book",
                    "date_created": "2021-01-06T04:13:49.290Z"
                },
                {
                    "id": 2,
                    "user_id": 2,
                    "title": "The Healing Kitchen",
                    "link": "https://www.thepaleomom.com/books/the-healing-kitchen/",
                    "by": "Sarah Ballantyne",
                    "content": "",
                    "post_type": "recipe",
                    "date_created": "2021-01-06T04:14:34.353Z"
                },
                {
                    "id": 3,
                    "user_id": 1,
                    "title": "Reinventing the Body, Resurrecting the Soul",
                    "link": "",
                    "by": "Deepak Chopra",
                    "content": "Transformation can't stop with the body, however; it must involve the soul. The soul–seemingly invisible, aloof, and apart from the material world–actually creates the body. Only by going to the level of the soul will you access your full potential, bringing more intelligence, creativity, and awareness into every aspect of your life.",
                    "post_type": "book",
                    "date_created": "2021-01-06T04:14:50.463Z"
                },
                {
                    "id": 4,
                    "user_id": 3,
                    "title": "Awakening Your True Self into 2021",
                    "link": "https://mysolluna.com/blog/2021/01/04/awakening-your-true-self-into-2021-episode-539/",
                    "by": "Kimberly Snyder",
                    "content": "",
                    "post_type": "podcast",
                    "date_created": "2021-01-06T04:14:58.674Z"
                },
                {
                    "id": 5,
                    "user_id": 2,
                    "title": "An amazing event",
                    "link": "https://www.google.com/",
                    "by": "",
                    "content": "Stay Inspired. Stay Connected.",
                    "post_type": "event",
                    "date_created": "2021-01-06T04:14:58.674Z"
                }
            ])
        })

        it(`should respond with 200 and post with id 1`, () => {
            return supertest(app)
              .get('/api/posts/1')
              .expect(200, 
                {
                    "id": 1,
                    "user_id": 1,
                    "title": "The Heart of a Woman",
                    "link": "https://www.penguinrandomhouse.com/books/3954/the-heart-of-a-woman-by-maya-angelou/",
                    "by": "Maya Angelou",
                    "content": "In The Heart of a Woman, Maya Angelou leaves California with her son, Guy, to move to New York. There she enters the society and world of black artists and writers, reads her work at the Harlem Writers Guild, and begins to take part in the struggle of black Americans for their rightful place in the world. In the meantime, her personal life takes an unexpected turn.",
                    "post_type": "book",
                    "date_created": "2021-01-06T04:13:49.290Z"
                },
                )
          })
          it(`POST /api/posts/:username`, () => {
            return supertest(app)
              .post('/api/posts/jondoe6')
              .send({ title: "The Paleo Approach", link:"www.google.com", by:"Sarah Ballantyne",
              content:"Some amazing stuff", post_type:"recipe" })
              .expect(201, 
                {
                    id: 48,
                    user_id: 4,
                    title: 'The Paleo Approach',
                    link: 'www.google.com',
                    by: 'Sarah Ballantyne',
                    content: 'Some amazing stuff',
                    post_type: 'recipe',
                    date_created: '2021-01-26T06:00:00.000Z'
                  }
                
                )
          })
    
        })

      })




