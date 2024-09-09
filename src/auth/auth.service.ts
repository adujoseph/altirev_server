import {
    BadRequestException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import ms from 'ms';
import crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import randomstring from 'randomstring';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthProvidersEnum } from './auth-providers.enum';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { NullableType } from '../utils/types/nullable.type';
import { LoginResponseDto } from './dto/login-response.dto';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { UsersService } from '../users/users.service';
import { AllConfigType } from '../config/config.type';
import { MailService } from '../mail/mail.service';
import { Session } from '../session/domain/session';
import { SessionService } from '../session/session.service';
import { User } from '../users/domain/user';
import { TokenDto } from './dto/token.dto';
import { TokenService } from './token.service';
import { RegTokenDto } from './dto/reg-token.dto';
import { ApiResponseDto, ApiResponseType } from '../utils/dto/api-response.dto';
import {
    RolesEnum,
    StatusEnum,
} from '../users/persistence/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
        private sessionService: SessionService,
        private mailService: MailService,
        private tokenService: TokenService,
        private configService: ConfigService<AllConfigType>,
    ) {}

    async validateLogin(
        loginDto: AuthEmailLoginDto,
    ): Promise<LoginResponseDto> {
        const user = await this.usersService.findByEmail(loginDto.email);

        if (!user) {
            throw new UnprocessableEntityException({
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    email: 'notFound',
                },
            });
        }

        if (user.provider !== AuthProvidersEnum.email) {
            throw new UnprocessableEntityException({
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    email: `needLoginViaProvider:${user.provider}`,
                },
            });
        }

        if (!user.password) {
            throw new UnprocessableEntityException({
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    password: 'incorrectPassword',
                },
            });
        }

        const isValidPassword = await bcrypt.compare(
            loginDto.password,
            user.password,
        );

        if (!isValidPassword) {
            throw new UnprocessableEntityException({
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    password: 'Incorrect Email or Password',
                },
            });
        }

        const hash = crypto
            .createHash('sha256')
            .update(randomStringGenerator())
            .digest('hex');

        const userId = user.id;
        const session = await this.sessionService.create({
            userId,
            hash,
        });

        const { token, refreshToken, tokenExpires } = await this.getTokensData({
            id: user.id,
            role: user.role,
            sessionId: session.id,
            hash,
        });

        return {
            refreshToken,
            token,
            tokenExpires,
            user,
        };
    }

    async register(dto: AuthRegisterLoginDto): Promise<LoginResponseDto> {
        await this.usersService.create({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            password: dto.password,
            role: RolesEnum.USER,
            status: StatusEnum.ACTIVE,
            username: dto.username,
            phoneNumber: dto.phoneNumber,
            gender: dto.gender,
            state: dto.state,
            country: dto.country,
            paymentRef: dto.paymentRef,
            planId: dto.planId,
        });

        // const hash = await this.jwtService.signAsync(
        //   {
        //     confirmEmailUserId: user.id,
        //   },
        //   {
        //     secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
        //       infer: true,
        //     }),
        //     expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
        //       infer: true,
        //     }),
        //   },
        // );

        // await this.mailService.userSignUpVerifyLink({
        //   to: dto.email,
        //   data: {
        //     hash,
        //   },
        // });

        //generate token
        // const otpToken = this.generateOTP();

        //send token by email
        // await this.mailService.userSignUpVerifyOTP({
        //   to: dto.email,
        //   data: {
        //     otp: otpToken,
        //   },
        // });

        // //save generated token
        // const tokenData = new TokenDto();
        // tokenData.email = dto.email;

        //hash token for a save
        // const salt = await bcrypt.genSalt();
        // tokenData.token = await bcrypt.hash(otpToken, salt);
        // tokenData.token = otpToken;
        //
        // const createdToken = await this.tokenService.createToken(tokenData);
        // if (!createdToken) {
        //   throw new UnprocessableEntityException('Unable to save user token');
        // }

        return await this.validateLogin({
            email: dto.email,
            password: dto.password,
        });
        // return { userAltirevId: user.altirevId };
    }

    private generateOTP() {
        return randomstring.generate({
            length: 6,
            charset: 'numeric',
        });
    }

    async confirmEmail(hash: string): Promise<void> {
        let userId: User['id'];

        try {
            const jwtData = await this.jwtService.verifyAsync<{
                confirmEmailUserId: User['id'];
            }>(hash, {
                secret: this.configService.getOrThrow(
                    'auth.confirmEmailSecret',
                    {
                        infer: true,
                    },
                ),
            });

            userId = jwtData.confirmEmailUserId;
        } catch {
            throw new UnprocessableEntityException({
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    hash: `invalidHash`,
                },
            });
        }

        const user = await this.usersService.findById(userId);

        if (
            !user ||
            user?.status?.toString() !== StatusEnum.INACTIVE.toString()
        ) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                error: `notFound`,
            });
        }
        if (
            !user ||
            user?.status?.toString() !== StatusEnum.INACTIVE.toString()
        ) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                error: `notFound`,
            });
        }

        user.status = StatusEnum.ACTIVE;
        user.status = StatusEnum.ACTIVE;

        await this.usersService.update(user.id, user);
    }

    async confirmNewEmail(hash: string): Promise<void> {
        let userId: User['id'];
        let newEmail: User['email'];

        try {
            const jwtData = await this.jwtService.verifyAsync<{
                confirmEmailUserId: User['id'];
                newEmail: User['email'];
            }>(hash, {
                secret: this.configService.getOrThrow(
                    'auth.confirmEmailSecret',
                    {
                        infer: true,
                    },
                ),
            });

            userId = jwtData.confirmEmailUserId;
            newEmail = jwtData.newEmail;
        } catch {
            throw new UnprocessableEntityException({
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    hash: `invalidHash`,
                },
            });
        }

        const user = await this.usersService.findById(userId);

        if (!user) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                error: `notFound`,
            });
        }

        user.email = newEmail;
        user.status = StatusEnum.ACTIVE;

        await this.usersService.update(user.id, user);
    }

    async forgotPassword(email: string): Promise<ApiResponseDto> {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnprocessableEntityException({
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    email: 'emailNotExists',
                },
            });
        }

        const tokenExpiresIn = this.configService.getOrThrow(
            'auth.forgotExpires',
            {
                infer: true,
            },
        );

        const tokenExpires = Date.now() + ms(tokenExpiresIn);

        const hash = await this.jwtService.signAsync(
            {
                forgotUserId: user.id,
            },
            {
                secret: this.configService.getOrThrow('auth.forgotSecret', {
                    infer: true,
                }),
                expiresIn: tokenExpiresIn,
            },
        );

        await this.mailService.forgotPassword({
            to: email,
            data: {
                hash,
                tokenExpires,
            },
        });

        return {
            status: ApiResponseType.SUCCESS,
            message: 'A reset link has been sent to your email',
            data: null,
        };
    }

    async resetPassword(
        hash: string,
        password: string,
    ): Promise<ApiResponseDto> {
        let userId: User['id'];

        try {
            const jwtData = await this.jwtService.verifyAsync<{
                forgotUserId: User['id'];
            }>(hash, {
                secret: this.configService.getOrThrow('auth.forgotSecret', {
                    infer: true,
                }),
            });

            userId = jwtData.forgotUserId;
        } catch {
            throw new UnprocessableEntityException({
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    hash: `invalidHash`,
                },
            });
        }

        const user = await this.usersService.findById(userId);

        if (!user) {
            throw new UnprocessableEntityException({
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    hash: `notFound`,
                },
            });
        }

        user.password = password;

        await this.sessionService.deleteByUserId({
            userId: user.id,
        });

        await this.usersService.update(user.id, user);

        return {
            status: ApiResponseType.SUCCESS,
            message: 'Password reset successfully',
            data: null,
        };
    }

    async me(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
        return this.usersService.findById(userJwtPayload.id);
    }

    async update(
        userJwtPayload: JwtPayloadType,
        userDto: AuthUpdateDto,
    ): Promise<NullableType<User>> {
        const currentUser = await this.usersService.findById(userJwtPayload.id);

        if (!currentUser) {
            throw new UnprocessableEntityException({
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    user: 'userNotFound',
                },
            });
        }

        if (userDto.password) {
            if (!userDto.oldPassword) {
                throw new UnprocessableEntityException({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        oldPassword: 'missingOldPassword',
                    },
                });
            }

            if (!currentUser.password) {
                throw new UnprocessableEntityException({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        oldPassword: 'incorrectOldPassword',
                    },
                });
            }

            const isValidOldPassword = await bcrypt.compare(
                userDto.oldPassword,
                currentUser.password,
            );

            if (!isValidOldPassword) {
                throw new UnprocessableEntityException({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        oldPassword: 'incorrectOldPassword',
                    },
                });
            } else {
                await this.sessionService.deleteByUserIdWithExclude({
                    userId: currentUser.id,
                    excludeSessionId: userJwtPayload.sessionId,
                });
            }
        }

        if (userDto.email && userDto.email !== currentUser.email) {
            const userByEmail = await this.usersService.findByEmail(
                userDto.email,
            );

            if (userByEmail && userByEmail.id !== currentUser.id) {
                throw new UnprocessableEntityException({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        email: 'emailExists',
                    },
                });
            }

            const hash = await this.jwtService.signAsync(
                {
                    confirmEmailUserId: currentUser.id,
                    newEmail: userDto.email,
                },
                {
                    secret: this.configService.getOrThrow(
                        'auth.confirmEmailSecret',
                        {
                            infer: true,
                        },
                    ),
                    expiresIn: this.configService.getOrThrow(
                        'auth.confirmEmailExpires',
                        {
                            infer: true,
                        },
                    ),
                },
            );

            await this.mailService.confirmNewEmail({
                to: userDto.email,
                data: {
                    hash,
                },
            });
        }

        delete userDto.email;
        delete userDto.oldPassword;

        await this.usersService.update(userJwtPayload.id, userDto);

        return this.usersService.findById(userJwtPayload.id);
    }

    async refreshToken(
        data: Pick<JwtRefreshPayloadType, 'sessionId' | 'hash'>,
    ): Promise<Omit<LoginResponseDto, 'user'>> {
        const session = await this.sessionService.findById(data.sessionId);

        if (!session) {
            throw new UnauthorizedException();
        }

        if (session.hash !== data.hash) {
            throw new UnauthorizedException();
        }

        const hash = crypto
            .createHash('sha256')
            .update(randomStringGenerator())
            .digest('hex');

        const user = await this.usersService.findById(session.userId);

        if (!user?.role) {
            throw new UnauthorizedException();
        }

        await this.sessionService.update(session.id, {
            hash,
        });

        const { token, refreshToken, tokenExpires } = await this.getTokensData({
            id: session.userId,
            role: user.role,
            sessionId: session.id,
            hash,
        });

        return {
            token,
            refreshToken,
            tokenExpires,
        };
    }

    async softDelete(user: User): Promise<void> {
        await this.usersService.remove(user.id);
    }

    async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
        return this.sessionService.deleteById(data.sessionId);
    }

    private async getTokensData(data: {
        id: User['id'];
        role: User['role'];
        sessionId: Session['id'];
        hash: Session['hash'];
    }) {
        const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
            infer: true,
        });

        const tokenExpires = Date.now() + ms(tokenExpiresIn);

        const [token, refreshToken] = await Promise.all([
            await this.jwtService.signAsync(
                {
                    id: data.id,
                    role: data.role,
                    sessionId: data.sessionId,
                },
                {
                    secret: this.configService.getOrThrow('auth.secret', {
                        infer: true,
                    }),
                    expiresIn: tokenExpiresIn,
                },
            ),
            await this.jwtService.signAsync(
                {
                    sessionId: data.sessionId,
                    hash: data.hash,
                },
                {
                    secret: this.configService.getOrThrow(
                        'auth.refreshSecret',
                        {
                            infer: true,
                        },
                    ),
                    expiresIn: this.configService.getOrThrow(
                        'auth.refreshExpires',
                        {
                            infer: true,
                        },
                    ),
                },
            ),
        ]);

        return {
            token,
            refreshToken,
            tokenExpires,
        };
    }

    async verifyOtpToken(dto: TokenDto): Promise<ApiResponseDto> {
        const { email, token } = dto;

        // fetch the otp by email
        const tokenEntity = await this.tokenService.getTokenByUserEmail(email);
        if (!tokenEntity) {
            throw new BadRequestException({
                status: ApiResponseType.ERROR,
                message: 'No token found',
                data: null,
            });
        }

        // isValidToken = await bcrypt.compare(token, tokenEntity.token);
        const isValidToken = token == tokenEntity.token;
        if (!isValidToken) {
            throw new BadRequestException({
                status: ApiResponseType.ERROR,
                message: 'Token is Incorrect',
                data: null,
            });
        }

        //once verified, delete from db
        await this.tokenService.deleteTokenByEmail(tokenEntity.id);
        return {
            status: ApiResponseType.SUCCESS,
            message: 'Token verified',
            data: null,
        };
    }

    async sendOtp(regDto: RegTokenDto) {
        //check users if the email exists
        const { email, phone } = regDto;

        // check if user exists
        const user = await this.usersService.findByEmail(email);
        if (user) {
            throw new BadRequestException('User with Email Exists');
        }

        //check if the token phone exists
        const userByPhone = await this.usersService.findByPhone(phone);
        if (userByPhone) {
            throw new BadRequestException('User with Phone Number Exists');
        }

        const existingToken = await this.tokenService.getTokenByUserEmail(
            regDto.email,
        );
        if (existingToken) {
            const responseDto = await this.resendOtp(regDto);
            if (responseDto.status == ApiResponseType.SUCCESS) {
                return responseDto;
            }
        }

        //generate token
        const otpToken = this.generateOTP();

        console.log('send TOKEN : ', otpToken);

        //send token by email
        await this.mailService.userSignUpVerifyOTP({
            to: regDto.email,
            data: {
                otp: otpToken,
            },
        });

        //save generated token
        const tokenData = new TokenDto();
        tokenData.email = regDto.email;

        //encrypt token for a save
        // tokenData.token = await encryptData(otpToken);
        tokenData.token = otpToken;
        // tokenData.token = bcrypt.encodeBase64(otpToken, 6);

        console.log('send TOKEN : ', tokenData.token);

        const createdToken = await this.tokenService.createToken(tokenData);
        if (!createdToken) {
            throw new UnprocessableEntityException('Unable to save user token');
        }

        const response = new ApiResponseDto();
        response.status = ApiResponseType.SUCCESS;
        response.message = 'Token Sent to your email';
        return response;
    }

    async resendOtp(regDto: RegTokenDto): Promise<ApiResponseDto> {
        //check users if the email exists
        const { email } = regDto;
        // check if token exists
        const tokenEntity = await this.tokenService.getTokenByUserEmail(email);
        if (!tokenEntity) {
            return {
                status: ApiResponseType.ERROR,
                message: 'Token not found email',
                data: null,
            };
        }

        //generate token
        // const otpToken = bcrypt.decodeBase64(tokenEntity.token, 6);
        const otpToken = tokenEntity.token;
        console.log('resend TOKEN : ', otpToken);

        //send token by email
        await this.mailService.userSignUpVerifyOTP({
            to: regDto.email,
            data: {
                otp: otpToken,
            },
        });

        const response = new ApiResponseDto();
        response.status = ApiResponseType.SUCCESS;
        response.message = 'Token Sent to your email';
        return response;
    }

    // async updateUserRole(
    //     userJwtPayload: JwtPayloadType,
    //     userDto: AuthUpdateDto,
    // ): Promise<NullableType<User>> {
    //     const currentUser = await this.usersService.findById(userJwtPayload.id);

    //     if (!currentUser) {
    //         throw new UnprocessableEntityException({
    //             status: HttpStatus.UNPROCESSABLE_ENTITY,
    //             errors: {
    //                 user: 'userNotFound',
    //             },
    //         });
    //     }
    // }
}
