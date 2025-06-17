require 'spec_helper'
require_relative '../../../../src/code-forensics/infrastructure/analysers/git_log'

RSpec.describe CodeForensics::Infrastructure::Analysers::GitLog do
  let(:target_repository_path) { '/path/to/repo' }
  let(:temp_dir) { File.join(target_repository_path, 'code-forensics', 'tmp', 'gitlog') }
  let(:start_date) { Date.new(2023, 1, 1) }
  let(:end_date) { Date.new(2023, 12, 31) }

  subject(:git_client) { described_class.new(target_repository_path) }

  before do
    allow(Open3).to receive(:capture3).with('git --version').and_return(['git version 2.39.0', '', double(success?: true)])
    allow(File).to receive(:directory?).with(target_repository_path).and_return(true)
    allow(File).to receive(:directory?).with(temp_dir).and_return(false)
    allow(FileUtils).to receive(:mkdir_p).with(temp_dir)
  end

  describe '#initialize' do
    context 'when git is installed and repository exists' do
      it 'creates the git client successfully' do
        expect { git_client }.not_to raise_error
      end

      it 'creates the temp directory' do
        git_client
        expect(FileUtils).to have_received(:mkdir_p).with(temp_dir)
      end
    end

    context 'when git is not installed' do
      before do
        allow(Open3).to receive(:capture3).with('git --version').and_return(['', 'command not found', double(success?: false)])
      end

      it 'raises GitNotFoundError' do
        expect { git_client }.to raise_error(
          CodeForensics::Infrastructure::Analysers::GitLog::GitNotFoundError,
          'Git is not installed. Please install git and try again.'
        )
      end
    end

    context 'when repository path does not exist' do
      before do
        allow(File).to receive(:directory?).with(target_repository_path).and_return(false)
      end

      it 'raises InvalidRepositoryError' do
        expect { git_client }.to raise_error(
          CodeForensics::Infrastructure::Analysers::GitLog::InvalidRepositoryError,
          "Repository path #{target_repository_path} does not exist. Please provide a valid repository path."
        )
      end
    end

    context 'when temp directory already exists' do
      before do
        allow(File).to receive(:directory?).with(temp_dir).and_return(true)
      end

      it 'does not create the temp directory' do
        git_client
        expect(FileUtils).not_to have_received(:mkdir_p)
      end
    end
  end

  describe '#run' do
    let(:expected_output_file) { File.join(temp_dir, "#{start_date.iso8601}-#{end_date.iso8601}.log") }
    let(:git_output) { "[abc123] John Doe 2023-01-01 Initial commit\n1\t0\tfile.rb" }
    let(:file_double) { instance_double(File) }

    before do
      allow(File).to receive(:open).and_call_original
      allow(File).to receive(:open).with(any_args).and_call_original
      allow(File).to receive(:open).with(anything, 'w').and_yield(file_double)
      allow(file_double).to receive(:write)
      allow(Open3).to receive(:capture3).and_return([git_output, '', double(success?: true)])
    end

    context 'with valid dates' do
      it 'executes git log command and returns output file path' do
        result = git_client.run(start_date: start_date, end_date: end_date)

        expect(result).to eq(expected_output_file)
      end

      it 'calls git with correct parameters' do
        git_client.run(start_date: start_date, end_date: end_date)

        expect(Open3).to have_received(:capture3).with(
          'git',
          'log',
          '--pretty=format:[%h] %aN %ad %s',
          '--date=short',
          '--numstat',
          "--since=#{start_date.iso8601}",
          "--until=#{end_date.iso8601}",
          chdir: target_repository_path
        )
      end

      it 'writes git output to file' do
        git_client.run(start_date: start_date, end_date: end_date)

        expect(file_double).to have_received(:write).with(git_output)
      end
    end

    context 'when git command fails' do
      before do
        # Allow git --version to succeed during initialization
        allow(Open3).to receive(:capture3).with('git --version').and_return(['git version 2.39.0', '', double(success?: true)])
        # Make the actual git log command fail
        allow(Open3).to receive(:capture3).with(
          'git', 'log', '--pretty=format:[%h] %aN %ad %s', '--date=short', '--numstat',
          "--since=#{start_date.iso8601}", "--until=#{end_date.iso8601}", chdir: target_repository_path
        ).and_return(['', 'fatal: not a git repository', double(success?: false)])
      end

      it 'raises StandardError with git error message' do
        expect { git_client.run(start_date: start_date, end_date: end_date) }.to raise_error(
          StandardError,
          'Git log command failed: fatal: not a git repository'
        )
      end
    end

    context 'with invalid start_date' do
      it 'raises ArgumentError when start_date is not a Date' do
        expect { git_client.run(start_date: '2023-01-01', end_date: end_date) }.to raise_error(
          ArgumentError,
          'start_date must be a Date object'
        )
      end
    end

    context 'with invalid end_date' do
      it 'raises ArgumentError when end_date is not a Date' do
        expect { git_client.run(start_date: start_date, end_date: '2023-12-31') }.to raise_error(
          ArgumentError,
          'end_date must be a Date object'
        )
      end
    end

    context 'when start_date is after end_date' do
      let(:invalid_start_date) { Date.new(2023, 12, 31) }
      let(:invalid_end_date) { Date.new(2023, 1, 1) }

      it 'raises ArgumentError' do
        expect { git_client.run(start_date: invalid_start_date, end_date: invalid_end_date) }.to raise_error(
          ArgumentError,
          'start_date must be before end_date'
        )
      end
    end

    context 'when dates are the same' do
      let(:same_date) { Date.new(2023, 6, 15) }

      it 'does not raise an error' do
        expect { git_client.run(start_date: same_date, end_date: same_date) }.not_to raise_error
      end
    end
  end

  describe 'private methods' do
    describe '#generate_output_filename' do
      it 'generates filename with ISO8601 formatted dates' do
        expected_filename = File.join(temp_dir, "#{start_date.iso8601}-#{end_date.iso8601}.log")

        result = git_client.send(:generate_output_filename, start_date, end_date)

        expect(result).to eq(expected_filename)
      end
    end

    describe '#build_git_command' do
      it 'builds git command array with correct parameters' do
        expected_command = [
          'git',
          'log',
          '--pretty=format:[%h] %aN %ad %s',
          '--date=short',
          '--numstat',
          "--since=#{start_date.iso8601}",
          "--until=#{end_date.iso8601}"
        ]

        result = git_client.send(:build_git_command, start_date, end_date)

        expect(result).to eq(expected_command)
      end
    end
  end
end
