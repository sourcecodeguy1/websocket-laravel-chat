# Versioning Scheme

Laravel and its other first-party packages follow Semantic Versioning. Major framework releases are released every year (~Q1), while minor and patch releases may be released as often as every week. Minor and patch releases should never contain breaking changes.

When referencing the Laravel framework or its components from your application or package, you should always use a version constraint such as ^11.0, since major releases of Laravel do include breaking changes. However, we strive to always ensure you may update to a new major release in one day or less.

# Named Arguments

Named arguments are not covered by Laravel's backwards compatibility guidelines. We may choose to rename function arguments when necessary in order to improve the Laravel codebase. Therefore, using named arguments when calling Laravel methods should be done cautiously and with the understanding that the parameter names may change in the future.

# Laravel 11

Laravel 11 continues the improvements made in Laravel 10.x by introducing a streamlined application structure, per-second rate limiting, health routing, graceful encryption key rotation, queue testing improvements, Resend mail transport, Prompt validator integration, new Artisan commands, and more. In addition, Laravel Reverb, a first-party, scalable WebSocket server has been introduced to provide robust real-time capabilities to your applications.

# PHP 8.2

Laravel 11.x requires a minimum PHP version of 8.2.

# Streamlined Application Structure

Laravel's streamlined application structure was developed by Taylor Otwell and Nuno Maduro.

Laravel 11 introduces a streamlined application structure for new Laravel applications, without requiring any changes to existing applications. The new application structure is intended to provide a leaner, more modern experience, while retaining many of the concepts that Laravel developers are already familiar with. Below we will discuss the highlights of Laravel's new application structure.

**The Application Bootstrap File**

The bootstrap/app.php file has been revitalized as a code-first application configuration file. From this file, you may now customize your application's routing, middleware, service providers, exception handling, and more. This file unifies a variety of high-level application behavior settings that were previously scattered throughout your application's file structure:

```php
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
```
# Service Providers

Instead of the default Laravel application structure containing five service providers, Laravel 11 only includes a single AppServiceProvider. The functionality of the previous service providers has been incorporated into the bootstrap/app.php, is handled automatically by the framework, or may be placed in your application's AppServiceProvider.

For example, event discovery is now enabled by default, largely eliminating the need for manual registration of events and their listeners. However, if you do need to manually register events, you may simply do so in the AppServiceProvider. Similarly, route model bindings or authorization gates you may have previously registered in the AuthServiceProvider may also be registered in the AppServiceProvider.

# Opt-in API and Broadcast Routing

The api.php and channels.php route files are no longer present by default, as many applications do not require these files. Instead, they may be created using simple Artisan commands:

```php
php artisan install:api
 
php artisan install:broadcasting

```

# Middleware

Previously, new Laravel applications included nine middleware. These middleware performed a variety of tasks such as authenticating requests, trimming input strings, and validating CSRF tokens.

In Laravel 11, these middleware have been moved into the framework itself, so that they do not add bulk to your application's structure. New methods for customizing the behavior of these middleware have been added to the framework and may be invoked from your application's bootstrap/app.php file:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(
        except: ['stripe/*']
    );
 
    $middleware->web(append: [
        EnsureUserIsSubscribed::class,
    ])
})
```
Since all middleware can be easily customized via your application's bootstrap/app.php, the need for a separate HTTP "kernel" class has been eliminated.

# Scheduling

Using a new Schedule facade, scheduled tasks may now be defined directly in your application's routes/console.php file, eliminating the need for a separate console "kernel" class:

```php
use Illuminate\Support\Facades\Schedule;
 
Schedule::command('emails:send')->daily();

```

# Exception Handling

Like routing and middleware, exception handling can now be customized from your application's bootstrap/app.php file instead of a separate exception handler class, reducing the overall number of files included in a new Laravel application:

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->dontReport(MissedFlightException::class);
 
    $exceptions->report(function (InvalidOrderException $e) {
        // ...
    });
})
```
# Base Controller Class

The base controller included in new Laravel applications has been simplified. It no longer extends Laravel's internal Controller class, and the AuthorizesRequests and ValidatesRequests traits have been removed, as they may be included in your application's individual controllers if desired:
```php
<?php
 
namespace App\Http\Controllers;
 
abstract class Controller
{
    //
}
```

# Application Defaults

By default, new Laravel applications use SQLite for database storage, as well as the database driver for Laravel's session, cache, and queue. This allows you to begin building your application immediately after creating a new Laravel application, without being required to install additional software or create additional database migrations.

In addition, over time, the database drivers for these Laravel services have become robust enough for production usage in many application contexts; therefore, they provide a sensible, unified choice for both local and production applications.

# Laravel Reverb

Laravel Reverb was developed by Joe Dixon.

Laravel Reverb brings blazing-fast and scalable real-time WebSocket communication directly to your Laravel application, and provides seamless integration with Laravel’s existing suite of event broadcasting tools, such as Laravel Echo.
```php
php artisan reverb:start
```
In addition, Reverb supports horizontal scaling via Redis's publish / subscribe capabilities, allowing you to distribute your WebSocket traffic across multiple backend Reverb servers all supporting a single, high-demand application.

For more information on Laravel Reverb, please consult the complete Reverb documentation.

# Per-Second Rate Limiting

Per-second rate limiting was contributed by Tim MacDonald.

Laravel now supports "per-second" rate limiting for all rate limiters, including those for HTTP requests and queued jobs. Previously, Laravel's rate limiters were limited to "per-minute" granularity:
```php
RateLimiter::for('invoices', function (Request $request) {
    return Limit::perSecond(1);
});
```
For more information on rate limiting in Laravel, check out the rate limiting documentation.

# Health Routing

Health routing was contributed by Taylor Otwell.

New Laravel 11 applications include a health routing directive, which instructs Laravel to define a simple health-check endpoint that may be invoked by third-party application health monitoring services or orchestration systems like Kubernetes. By default, this route is served at /up:
```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
```
When HTTP requests are made to this route, Laravel will also dispatch a DiagnosingHealth event, allowing you to perform additional health checks that are relevant to your application.

# Graceful Encryption Key Rotation

Graceful encryption key rotation was contributed by Taylor Otwell.

Since Laravel encrypts all cookies, including your application's session cookie, essentially every request to a Laravel application relies on encryption. However, because of this, rotating your application's encryption key would log all users out of your application. In addition, decrypting data that was encrypted by the previous encryption key becomes impossible.

Laravel 11 allows you to define your application's previous encryption keys as a comma-delimited list via the APP_PREVIOUS_KEYS environment variable.

When encrypting values, Laravel will always use the "current" encryption key, which is within the APP_KEY environment variable. When decrypting values, Laravel will first try the current key. If decryption fails using the current key, Laravel will try all previous keys until one of the keys is able to decrypt the value.

This approach to graceful decryption allows users to keep using your application uninterrupted even if your encryption key is rotated.

For more information on encryption in Laravel, check out the encryption documentation.

# Automatic Password Rehashing

Automatic password rehashing was contributed by Stephen Rees-Carter.

Laravel's default password hashing algorithm is bcrypt. The "work factor" for bcrypt hashes can be adjusted via the config/hashing.php configuration file or the BCRYPT_ROUNDS environment variable.

Typically, the bcrypt work factor should be increased over time as CPU / GPU processing power increases. If you increase the bcrypt work factor for your application, Laravel will now gracefully and automatically rehash user passwords as users authenticate with your application.

# Prompt Validation

Prompt validator integration was contributed by Andrea Marco Sartori.

Laravel Prompts is a PHP package for adding beautiful and user-friendly forms to your command-line applications, with browser-like features including placeholder text and validation.

Laravel Prompts supports input validation via closures:
```php
$name = text(
    label: 'What is your name?',
    validate: fn (string $value) => match (true) {
        strlen($value) < 3 => 'The name must be at least 3 characters.',
        strlen($value) > 255 => 'The name must not exceed 255 characters.',
        default => null
    }
);
```

However, this can become cumbersome when dealing with many inputs or complicated validation scenarios. Therefore, in Laravel 11, you may utilize the full power of Laravel's validator when validating prompt inputs:
```php
$name = text('What is your name?', validate: [
    'name' => 'required|min:3|max:255',
]);
```
# Queue Interaction Testing

Queue interaction testing was contributed by Taylor Otwell.

Previously, attempting to test that a queued job was released, deleted, or manually failed was cumbersome and required the definition of custom queue fakes and stubs. However, in Laravel 11, you may easily test for these queue interactions using the withFakeQueueInteractions method:
```php
use App\Jobs\ProcessPodcast;
 
$job = (new ProcessPodcast)->withFakeQueueInteractions();
 
$job->handle();
 
$job->assertReleased(delay: 30);
```

For more information on testing queued jobs, check out the queue documentation.

# New Artisan Commands

Class creation Artisan commands were contributed by Taylor Otwell.

New Artisan commands have been added to allow the quick creation of classes, enums, interfaces, and traits:
```php
php artisan make:class
php artisan make:enum
php artisan make:interface
php artisan make:trait
```

# Model Casts Improvements

Model casts improvements were contributed by Nuno Maduro.

Laravel 11 supports defining your model's casts using a method instead of a property. This allows for streamlined, fluent cast definitions, especially when using casts with arguments:
```php
/**
 * Get the attributes that should be cast.
 *
 * @return array<string, string>
 */
protected function casts(): array
{
    return [
        'options' => AsCollection::using(OptionCollection::class),
                  // AsEncryptedCollection::using(OptionCollection::class),
                  // AsEnumArrayObject::using(OptionEnum::class),
                  // AsEnumCollection::using(OptionEnum::class),
    ];
}
```
For more information on attribute casting, review the Eloquent documentation.

# The once Function

The once helper was contributed by Taylor Otwell and Nuno Maduro.

The once helper function executes the given callback and caches the result in memory for the duration of the request. Any subsequent calls to the once function with the same callback will return the previously cached result:
```php
function random(): int
{
    return once(function () {
        return random_int(1, 1000);
    });
}
 
random(); // 123
random(); // 123 (cached result)
random(); // 123 (cached result)
```
For more information on the once helper, check out the helpers documentation.

# Improved Performance When Testing With In-Memory Databases

Improved in-memory database testing performance was contributed by Anders Jenbo

Laravel 11 offers a significant speed boost when using the :memory: SQLite database during testing. To accomplish this, Laravel now maintains a reference to PHP's PDO object and reuses it across connections, often cutting total test run time in half.

# Improved Support for MariaDB

Improved support for MariaDB was contributed by Jonas Staudenmeir and Julius Kiekbusch

Laravel 11 includes improved support for MariaDB. In previous Laravel releases, you could use MariaDB via Laravel's MySQL driver. However, Laravel 11 now includes a dedicated MariaDB driver which provides better defaults for this database system.

For more information on Laravel's database drivers, check out the database documentation.

# nspecting Databases and Improved Schema Operations

Improved schema operations and database inspection was contributed by Hafez Divandari

Laravel 11 provides additional database schema operation and inspection methods, including the native modifying, renaming, and dropping of columns. Furthermore, advanced spatial types, non-default schema names, and native schema methods for manipulating tables, views, columns, indexes, and foreign keys are provided:
```php
use Illuminate\Support\Facades\Schema;
 
$tables = Schema::getTables();
$views = Schema::getViews();
$columns = Schema::getColumns('users');
$indexes = Schema::getIndexes('users');
$foreignKeys = Schema::getForeignKeys('users');
```