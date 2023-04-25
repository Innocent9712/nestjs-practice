import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto, AuthSignInDto } from 'src/dto';


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
        const AuthDto: AuthSignInDto = {
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
        .inspect()
      })
    })

    describe('Edit user', () => { 
    
    })
  })

  describe('Bookmark', () => { 
    describe('Create bookmark', () => { 
    
    })

    describe('Get bookmarks', () => { 
    
    })

    describe('Get bookmark by id', () => { 
    
    })

    describe('Edit bookmark by id', () => { 
    
    })

    describe('Delete bookmark by id', () => { 
    
    })
  })
})