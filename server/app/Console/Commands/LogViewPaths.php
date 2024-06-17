<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class LogViewPaths extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'log:view-paths';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Log the view paths configuration';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('View paths:');
        print_r(config('view.paths'));
        return 0;
    }
}
