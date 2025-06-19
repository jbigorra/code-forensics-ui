#!/usr/bin/env ruby

require_relative 'src/code-forensics/infrastructure/analysers/git_log'
require 'date'

# Test the GitLog class with the user's repository
target_repo = '/Users/jbigorra/Projects/code-forensics-ui'
start_date = Date.new(2025, 1, 1)  # Broader range to capture more history
end_date = Date.new(2025, 6, 18)

puts "Testing GitLog with repository: #{target_repo}"
puts "Date range: #{start_date} to #{end_date}"
puts

begin
  # Initialize the GitLog client
  puts "1. Initializing GitLog client..."
  git_client = CodeForensics::Infrastructure::Analysers::GitLog.new(target_repo)
  puts "✓ GitLog client initialized successfully"
  puts

  # Run the git log command
  puts "2. Running git log command..."
  output_file = git_client.run(start_date: start_date, end_date: end_date)
  puts "✓ Git log command executed successfully"
  puts "Output file: #{output_file}"
  puts

  # Check if the file exists and show some info
  if File.exist?(output_file)
    file_size = File.size(output_file)
    line_count = File.readlines(output_file).count
    puts "3. Output file analysis:"
    puts "   File size: #{file_size} bytes"
    puts "   Line count: #{line_count} lines"
    puts

    # Show first few lines and last few lines
    lines = File.readlines(output_file)
    puts "4. First 5 lines of output:"
    lines.first(5).each_with_index do |line, index|
      puts "   #{index + 1}: #{line.chomp}"
    end

    puts "\n5. Last 5 lines of output:"
    lines.last(5).each_with_index do |line, index|
      puts "   #{lines.length - 4 + index}: #{line.chomp}"
    end
  else
    puts "✗ Output file was not created"
  end

rescue => e
  puts "✗ Error occurred: #{e.class}: #{e.message}"
  puts "Backtrace:"
  puts e.backtrace.map { |line| "  #{line}" }
end
