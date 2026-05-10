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
    fun handleUserAlreadyExists(
        exception: UserAlreadyExistsException,
        request: HttpServletRequest
    ): ResponseEntity<ErrorDto> {
        val errorDto = ErrorDto(
            status = HttpStatus.CONFLICT.value(),
            error = HttpStatus.CONFLICT.reasonPhrase,
            message = exception.message ?: "User already exist",
            path = request.requestURI,
            details = null
        )
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorDto)
    }

    @ExceptionHandler(UserNotFoundException::class)
    fun handleUserNotFound(
        exception: UserNotFoundException,
        request: HttpServletRequest
    ): ResponseEntity<ErrorDto> {
        val errorDto = ErrorDto(
            status = HttpStatus.NOT_FOUND.value(),
            error = HttpStatus.NOT_FOUND.reasonPhrase,
            message = exception.message ?: "User not found",
            path = request.requestURI,
            details = null
        )
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorDto)
    }
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleMethodArgumentNotValid(
        exception: MethodArgumentNotValidException,
        request: HttpServletRequest
    ): ResponseEntity<ErrorDto> {
        val fieldErrors = buildErrorFields(exception)
        val errorDto = ErrorDto(
            status = HttpStatus.BAD_REQUEST.value(),
            error = HttpStatus.BAD_REQUEST.reasonPhrase,
            message = exception.message,
            path = request.requestURI,
            details = fieldErrors
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDto)
    }

    private fun buildErrorFields(exception: MethodArgumentNotValidException) =
        exception.bindingResult.fieldErrors.map { fieldError ->
            FieldErrorDto(
                field = fieldError.field,
                rejectedValue = fieldError.rejectedValue,
                message = fieldError.defaultMessage ?: "Field validation failed"
            )
        }
}