'use strict'

const cryto = require('crypto')
const date = require('date-fns')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = cryto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password'],
        { email, token: user.token, link: `${request.input('redirect_url')}?token=${user.token}` },
        message => {
          message
            .to(user.email)
            .from('willian.passarelli@hotmail.com', 'Willian | DevPass')
            .subject('Recuperação de senha')
        }
      )
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Algo não deu certo, esse e-mail existe?' } })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()

      const user = await User.findByorFail('token', token)

      const tokenExpired = date.isAfter(date.subDays(date.parseISO(), 2), user.token_created_at)

      if (tokenExpired) {
        return response.status(401).send({ error: { message: 'O token de recuperação está expirado' } })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Algo deu errado ao resetar sua senha' } })
    }
  }
}

module.exports = ForgotPasswordController
