package ru.rrtyui.moneytracker.exception

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import ru.rrtyui.moneytracker.exception.dto.ErrorDto
import ru.rrtyui.moneytracker.exception.dto.FieldErrorDto

@RestControllerAdvice
class GlobalControllerAdvice: ResponseEntityExceptionHandler() {

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

    @ExceptionHandler(CategoryAlreadyExistsException::class)
    fun handleCategoryAlreadyExists(
        exception: CategoryAlreadyExistsException,
        request: HttpServletRequest
    ): ResponseEntity<ErrorDto> {
        val errorDto = ErrorDto(
            status = HttpStatus.CONFLICT.value(),
            error = HttpStatus.CONFLICT.reasonPhrase,
            message = exception.message ?: "Category already exist",
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

    override fun handleMethodArgumentNotValid(
        exception: MethodArgumentNotValidException,
        headers: org.springframework.http.HttpHeaders,
        status: org.springframework.http.HttpStatusCode,
        request: WebRequest
    ): ResponseEntity<Any> {
        request as HttpServletRequest

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