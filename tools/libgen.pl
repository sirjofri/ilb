#!/usr/bin/env perl

=head1 NAME

libgen.pl - Generate library file for ILB

=head1 SYNOPSIS

B<< libgen.pl < >>filelist B<< > >> library.json

=head1 DESCRIPTION

This tool receives a list of files via STDIN and outputs a valid library.json file to STDOUT. You can use find to generate the filelist:

B<< find library -name "*.json" | libgen.pl >>

Do not forget the quotes because of shell globbing. For more information read the Readme.

=cut

use diagnostics;
use utf8;
use Encode;
use JSON;

use open ':std', ':encoding(UTF-8)';
binmode STDOUT, ":utf8";

my @records;

while($filename = <>) {
	chomp $filename;
	open my $fh, "<:encoding(UTF-8)", $filename or die "Can't open file $filename: $!";

	my @filein = <$fh>;
	my $str = join "", @filein;

	my $json = JSON->new->utf8->decode(encode('UTF-8', $str));

	delete $json->{content};
	delete $json->{license};
	delete $json->{license_url};
	delete $json->{license_text};
	delete $json->{direction};

	$json->{path} = "/$filename";
	push @records, $json;
}

my %library = (
	'library' => 'official',
	'path'    => '/library.json',
	'version' => '0.1',
	'list'    => \@records,
);

my $libstring = JSON->new->utf8->pretty->encode(\%library);
print $libstring;
