import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto, AuthSignInDto, EditUserDto } from '../src/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/dto/bookmark.dto';


describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const PORT = 3005
  const baseUrl = `http://localhost:${PORT}`

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, //strip unnecessary additions to a request
      }),
    );
    await app.init();
    await app.listen(PORT)

    prisma = app.get(PrismaService);

    await prisma.cleadDb()

    pactum.request.setBaseUrl(baseUrl)
  })

  afterAll(() => {app.close()})
  
  describe('Auth', () => { 
    describe('Signup', () => { 
      it('should signup', () => {
        const AuthDto: AuthDto = {
          email: 'test@test.com',
          password: 'test123',
          firstName: 'test',
          lastName: 'test'
        }
        return pactum.spec().post('/auth/signup')
        .withBody(AuthDto)
        .expectStatus(201)
        // .inspect()
      })
      it('should fail signup if email is invalid', () => {
        const AuthDto: AuthDto = {
          email: 'test123',
          password: 'test123',
        }
        return pactum.spec().post('/auth/signup')
        .withBody(AuthDto)
        .expectStatus(400)
      })
      it('should fail signup if email is empty', () => {
        const AuthDto = {
          password: 'test123',
        }
        return pactum.spec().post('/auth/signup')
        .withBody(AuthDto)
        .expectStatus(400)
      })
      it('should fail signup if password is empty', () => {
        const AuthDto = {
          email: 'test123',
        }
        return pactum.spec().post('/auth/signup')
        .withBody(AuthDto)
        .expectStatus(400)
      })
      it('should fail signup if no bodyis provided', () => {
        return pactum.spec().post('/auth/signup')
        .expectStatus(400)
      })
    })

    describe('Signin', () => { 
      it('should signin', () => {
        const AuthDto: AuthDto = {
          email: 'test@test.com',
          password: 'test123',
        }
        return pactum.spec().post('/auth/login')
        .withBody(AuthDto)
        .expectStatus(200)
        .stores("access_token", "jwt_access_token")
      })
      it('should fail signin if email is invalid', () => {
        const AuthDto: AuthSignInDto = {
          email: 'test123',
          password: 'test123',
        }
        return pactum.spec().post('/auth/login')
        .withBody(AuthDto)
        .expectStatus(400)
      })
      it('should fail signin if email is empty', () => {
        const AuthDto = {
          password: 'test123',
        }
        return pactum.spec().post('/auth/login')
        .withBody(AuthDto)
        .expectStatus(400)
      })
      it('should fail signin if password is empty', () => {
        const AuthDto = {
          email: 'test123',
        }
        return pactum.spec().post('/auth/login')
        .withBody(AuthDto)
        .expectStatus(400)
      })
      it('should fail signin if no bodyis provided', () => {
        return pactum.spec().post('/auth/login')
        .expectStatus(400)
      })
   })
    
  })

  describe('User', () => { 
    describe('Get current user', () => { 
      it('should get current user', () => {
        return pactum.spec().get('/users/me')
        .withBearerToken('$S{access_token}')
        .expectStatus(200)
        .stores("userId", "id")
      })
    })

    describe('Edit user', () => { 
      it('should edit user', () => {
        const UpdateUser: EditUserDto = {
          email: "updated@test.com"
        }

        return pactum.spec().patch('/users/$S{userId}')
        .withBearerToken('$S{access_token}')
        .withBody(UpdateUser)
        .expectStatus(200)
      })
    })
  })

  describe('Bookmark', () => {
    describe('Get empty bookmarks', () => { 
      it('should get an empty array', () => {
        return pactum.spec().get('/bookmarks')
        .withBearerToken('$S{access_token}')
        .expectStatus(200)
        .expectBody([])
      })
    })

    describe('Create bookmark', () => { 
      it('should create bookmark', () => {
        const bookmark: CreateBookmarkDto = {
          title: "test",
          url: "https://test.com"
        }
        return pactum.spec().post('/bookmarks')
        .withBearerToken('$S{access_token}')
        .withBody(bookmark)
        .expectStatus(201)
        .expectBodyContains('test')
      })
    })

    describe('Get bookmarks', () => { 
      it('should get bookmarks', () => {
        return pactum.spec().get('/bookmarks')
        .withBearerToken('$S{access_token}')
        .expectStatus(200)
        .expectJsonLength(1)
        .stores('firstBookmarkId', '[0].id')
      })
    })

    describe('Get bookmark by id', () => { 
      it('should respond with an empty body', () => {
        return pactum.spec().get('/bookmarks/9999')
        .withBearerToken('$S{access_token}')
        .expectStatus(200)
        .expectBody({})
      })
      it('should get bookmark by id', () => {
        return pactum.spec().get('/bookmarks/{id}')
        .withPathParams('id', '$S{firstBookmarkId}') // cleaner to use in case of params
        .withBearerToken('$S{access_token}')
        .expectStatus(200)
        .expectBodyContains('title')
      })
    })

    describe('Edit bookmark by id', () => { 
      const updateBookmark: EditBookmarkDto = {
        title: "updated title"
      }
      it('should edit bookmark by id', () => {
        return pactum.spec().patch('/bookmarks/$S{firstBookmarkId}')
        .withBearerToken('$S{access_token}')
        .withBody(updateBookmark)
        .expectStatus(200)
        .expectBodyContains(updateBookmark.title)
      })

      it('should fail to bookmark by id', () => {
        return pactum.spec().patch('/bookmarks/9999')
        .withBearerToken('$S{access_token}')
        .withBody(updateBookmark)
        .expectStatus(500)
      })
    })

    describe('Delete bookmark by id', () => { 
      it('should delete bookmark by id', () => {
        return pactum.spec().delete('/bookmarks/$S{firstBookmarkId}')
        .withBearerToken('$S{access_token}')
        .expectStatus(204)
    })
    it('should fail to bookmark with same id', () => {
      return pactum.spec().delete('/bookmarks/$S{firstBookmarkId}')
      .withBearerToken('$S{access_token}')
      .expectStatus(500)
    })
  })
  })
})