package ru.rrtyui.moneytracker.exception

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import java.time.LocalDateTime

@RestControllerAdvice
class GlobalExceptionHandler: ResponseEntityExceptionHandler() {

    @ExceptionHandler(UserAlreadyExistsException::class)
    fun handleUserAlreadyExists(ex: UserAlreadyExistsException, request: HttpServletRequest): ResponseEntity<ErrorDto> {

        val errorDto = ErrorDto(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.CONFLICT.value(),
            error = HttpStatus.CONFLICT.reasonPhrase,
            path = request.requestURI,
            message = ex.message?: "User with this username already exist", //TODO хз че написать адекватно
        )
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorDto)
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationExceptions(
        ex: MethodArgumentNotValidException,
        request: HttpServletRequest
    ): ResponseEntity<ErrorDto> {

        val fieldErrors = ex.bindingResult.fieldErrors.map {
            fieldError -> FieldErrorDto(
                field = fieldError.field,
                rejectedValue = fieldError.rejectedValue,
                message = fieldError.defaultMessage ?: "Field validation failed"
            )
        }

        val errorDto = ErrorDto(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.BAD_REQUEST.value(),
            error = HttpStatus.BAD_REQUEST.reasonPhrase,
            message = "Validation failed",
            path = request.requestURI,
            details = fieldErrors
        )

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDto)
    }
}