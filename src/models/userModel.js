import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { v4 as uuidv4, validate } from 'uuid'

const passwordValidator = function(v) { return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v) }
const passwordMessage = "Password must have at least 8 characters, including an uppercase letter, a number, and a special characte"
const emailValidator = function(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }

const userSchema = new mongoose.Schema({
    uuid: { type: String, unique: true, default: uuidv4, required: true, validate: validate },
    firstName: { type: String, required: true, minlength: 3, maxlength: 50, trim: true },
    lastName: { type: String, required: true, minlength: 3, maxlength: 50, trim: true },
    gender: { type: String,  enum: ['Male', 'Female', 'Mixed'],  required: true },
    email: { type: String, required: true, unique: true, validate: { validator: emailValidator, message: 'Invalid email'} },
    password: { type: String, required: true, minlength: 8, validate: { validator: passwordValidator, message: passwordMessage} },
    isActive: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    verificationToken: { type: String, default: null },
    verificationTokenExpiration: { type: Date, default: null },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    invitationToken: { type: String, default: null },
    invitationExpiration: { type: Date, default: null },
    avatar: { type: String, default: null },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

userSchema.virtual('skipSoftDelete').get(function() {
    if (this._skipSoftDelete === undefined) {
        this._skipSoftDelete = false 
    }
    return this._skipSoftDelete
}).set(function(value) {
    this._skipSoftDelete = value
})


userSchema.pre('save', async function(next) {
    try {
        if(!this.password) this.password = process.env.DEFAULT_PASSWORD
        if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10)
        if (this.isNew && this.invitedBy) this.generateInvitationToken()
        if (this.isNew && this.invitedBy == null) this.generateVerificationToken()
        next()
    }
    catch (err) {
        next(err)
    }
})

userSchema.post('save', async function(doc, next) {
    if (!doc.isActive && doc.verificationToken) {
        global.job.runLater('mailertQueue', 'mailerWorker', 'Verification', { userId: doc._id })
    }
    if (!doc.isActive && doc.invitationToken) {
        global.job.runLater('mailertQueue', 'mailerWorker', 'Invitation', { userId: doc._id })
    }
    next()
})

userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    if (this.skipSoftDelete) {
        return next()
    }

    await this.updateOne({ deletedAt: Date.now() })
    next()
})

userSchema.methods.comparePassword = async function(password) { return await bcrypt.compare(password, this.password) }

userSchema.methods.generateVerificationToken = function() {
    this.verificationToken = crypto.randomBytes(32).toString('hex')
    this.verificationTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
}

userSchema.methods.generateInvitationToken = function() {
    this.invitationToken = crypto.randomBytes(32).toString('hex')
    this.invitationExpiration = Date.now() + 48 * 60 * 60 * 1000
}

userSchema.methods.fullName = function() {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    return `${capitalize(this.firstName)} ${capitalize(this.lastName)}`
}

userSchema.methods.activateUser = async function(active = true) {
    try {
        this.isActive = active
        this.verificationToken = null
        this.verificationTokenExpiration = null
        this.invitationToken = null
        this.invitationExpiration = null
        await this.save()
    } catch (error) {
        throw new Error('Error activating user and clearing tokens')
    }
}


const User = mongoose.model('User', userSchema)
export default User

