require 'open3'
require 'fileutils'
require 'pathname'
require 'date'

module CodeForensics
  module Infrastructure
    module Analysers
      # Git client for generating log files with specified date ranges
      # This class handles git log operations and file output management
      class GitLog
        class GitNotFoundError < StandardError; end
        class InvalidRepositoryError < StandardError; end

        # @param target_repository_path [String] The absolute path to the target repository
        def initialize(target_repository_path)
          @target_repository_path = target_repository_path
          @temp_dir = File.join(target_repository_path, 'code-forensics', 'tmp', 'gitlog')

          validate_git_installation
          validate_repository_path
          ensure_temp_directory_exists
        end

        # Runs git log command with the specified date range
        # @param start_date [Date] The start date for the git log
        # @param end_date [Date] The end date for the git log
        # @return [String] The absolute path to the generated log file
        def run(start_date:, end_date:)
          validate_dates(start_date, end_date)

          output_file = generate_output_filename(start_date, end_date)
          git_command = build_git_command(start_date, end_date)

          execute_git_log(git_command, output_file)

          output_file
        end

        private

        attr_reader :target_repository_path, :temp_dir

        def validate_git_installation
          _, _, status = Open3.capture3('git --version')

          unless status.success?
            raise GitNotFoundError, 'Git is not installed. Please install git and try again.'
          end
        end

        def validate_repository_path
          unless File.directory?(target_repository_path)
            raise InvalidRepositoryError,
                  "Repository path #{target_repository_path} does not exist. Please provide a valid repository path."
          end
        end

        def ensure_temp_directory_exists
          FileUtils.mkdir_p(temp_dir) unless File.directory?(temp_dir)
        end

        def validate_dates(start_date, end_date)
          raise ArgumentError, 'start_date must be a Date object' unless start_date.is_a?(Date)
          raise ArgumentError, 'end_date must be a Date object' unless end_date.is_a?(Date)
          raise ArgumentError, 'start_date must be before end_date' if start_date > end_date
        end

        def generate_output_filename(start_date, end_date)
          filename = "#{start_date.iso8601}-#{end_date.iso8601}.log"
          File.join(temp_dir, filename)
        end

        def build_git_command(start_date, end_date)
          [
            'git',
            'log',
            '--pretty=format:[%h] %aN %ad %s',
            '--date=short',
            '--numstat',
            "--since=#{start_date.iso8601}",
            "--until=#{end_date.iso8601}"
          ]
        end

        def execute_git_log(git_command, output_file)
          File.open(output_file, 'w') do |file|
            stdout, stderr, status = Open3.capture3(*git_command, chdir: target_repository_path)

            unless status.success?
              raise StandardError, "Git log command failed: #{stderr}"
            end

            file.write(stdout)
          end
        end
      end
    end
  end
end
