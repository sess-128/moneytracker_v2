package ru.rrtyui.moneytracker.exception

import jakarta.servlet.http.HttpServletRequest
import java.time.LocalDateTime
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import ru.rrtyui.moneytracker.exception.dto.ErrorDto
import ru.rrtyui.moneytracker.exception.dto.FieldErrorDto

@RestControllerAdvice
class GlobalExceptionHandler: ResponseEntityExceptionHandler() {

    @ExceptionHandler(UserAlreadyExistsException::class)
    fun handleUserAlreadyExists(ex: UserAlreadyExistsException, request: HttpServletRequest): ResponseEntity<ErrorDto> {
        val errorDto = buildErrorDto(
            LocalDateTime.now(), HttpStatus.CONFLICT.value(), HttpStatus.CONFLICT.reasonPhrase,
            request.requestURI, ex.message.toString(), null
        )
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorDto)
    }

    override fun handleMethodArgumentNotValid(
        ex: MethodArgumentNotValidException, headers: HttpHeaders,
        status: HttpStatusCode, request: WebRequest
    ): ResponseEntity<Any> {
        val fieldErrors = buildErrorFields(ex)
        val errorDto = buildErrorDto(
            LocalDateTime.now(), HttpStatus.BAD_REQUEST.value(), HttpStatus.BAD_REQUEST.reasonPhrase,
            request.contextPath, "Validation failed",  fieldErrors
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDto)
    }

    private fun buildErrorFields(ex: MethodArgumentNotValidException) =
        ex.bindingResult.fieldErrors.map { fieldError ->
            FieldErrorDto(
                field = fieldError.field,
                rejectedValue = fieldError.rejectedValue,
                message = fieldError.defaultMessage ?: "Field validation failed"
            )
        }

    private fun buildErrorDto(
        now: LocalDateTime, value: Int, reasonPhrase: String, requestURI: String,
        message: String, filedErrors: List<FieldErrorDto>?
    ) = ErrorDto(
        timestamp = now,
        status = value,
        error = reasonPhrase,
        path = requestURI,
        message = message,
        details = filedErrors
    )
}